import { createFileRoute, Link } from "@tanstack/react-router";
import { useTool, useToolRawDefinition } from "@/hooks/useTools";
import { Button, OutlineButton } from "@/components/Button";
import { Tag, TagList } from "@/components/Tags";
import JsonView from "@uiw/react-json-view";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import ReactMarkdown from "react-markdown";
import he from "he";
import { ScrollArea } from "@base-ui/react/scroll-area";
import { useOidc } from "@/oidc";
import { m } from "@/paraglide/messages";
import { toolKeys } from "@/api/querykeys";
import { getToolById, getToolRawDefinition } from "@/api/tools";
import { getLocale } from "@/paraglide/runtime";

export const Route = createFileRoute("/tools/$id")({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    const { queryClient } = context as any;
    const id = Number(params.id);
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: toolKeys.detail(id),
        queryFn: () => getToolById(id),
      }),
      queryClient.prefetchQuery({
        queryKey: toolKeys.rawDefinition(id),
        queryFn: () => getToolRawDefinition(id),
      }),
    ]);
    return {
      tool: queryClient.getQueryData(toolKeys.detail(id)),
    };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: m.meta_title({ page: loaderData?.tool?.name }) }],
  }),
});

function RouteComponent() {
  const { id } = Route.useParams();
  const toolId = Number(id);
  const { isUserLoggedIn, decodedIdToken } = useOidc();

  const { data: tool, isLoading, isError } = useTool(toolId);
  const { data: rawDef, isLoading: rawLoading } = useToolRawDefinition(toolId);

  if (isLoading)
    return (
      <div className="p-20">
        <Loader />
      </div>
    );
  if (isError || !tool) return <Error message="Tool not found." />;

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 md:p-8 w-full">
      <h1 className="overflow-hidden text-ellipsis">{he.decode(tool.name)}</h1>
      <section className="mb-4 flex flex-wrap items-start gap-4">
        <div>
          <span className="text-gray-600 dark:text-gray-300 text-sm block">
            {m.version()}: {tool.version}
          </span>
          <span className="text-gray-600 dark:text-gray-300 text-sm block">
            {m.license()}: {tool.license ?? m.no_license()}
          </span>
          <span className="text-gray-600 dark:text-gray-300 text-sm block">
            {m.created_by()}: {tool.created_by}
          </span>
          <span className="text-gray-600 dark:text-gray-300 text-sm block">
            {m.created_at()}: {new Date(tool.created_at).toLocaleDateString(getLocale())}
          </span>
          {tool.updated_at && (
            <span className="text-gray-600 dark:text-gray-300 text-sm block">
              {m.updated_at()}: {new Date(tool.updated_at).toLocaleDateString(getLocale())}
            </span>
          )}
        </div>
        <div className="flex gap-2 ml-auto">
          {tool.location && (
            <Button
              render={
                <a
                  href={tool.location}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost small"
                />
              }
            >
              {m.open_location()}
            </Button>
          )}
          {isUserLoggedIn && decodedIdToken.sub === tool.created_by && (
            <OutlineButton
              className="mr-2"
              nativeButton={false}
              render={<Link to={`/tools/$id/edit`} params={{ id: String(toolId) }} />}
            >
              {m.edit_tool()}
            </OutlineButton>
          )}
        </div>
      </section>

      <section className="mb-6 bg-white dark:bg-[#0d1117] p-4 rounded-lg w-full">
        <ReactMarkdown
          components={{
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 hover:underline break-all"
              >
                {children}
              </a>
            ),
            p: ({ children }) => <p className="mb-1">{children}</p>,
            h2: ({ children }) => <h2 className="mb-1">{children}</h2>,
            h3: ({ children }) => <h3 className="mb-1">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc ml-6 mb-2">{children}</ul>,
          }}
        >
          {tool.description}
        </ReactMarkdown>
      </section>

      <section className="mb-4 max-w-full">
        {tool.types && <TagRow label={m.types()} tags={tool.types} col="types" />}
        {tool.tags && <TagRow label={m.tags()} tags={tool.tags} col="tags" />}
        {tool.keywords && <TagRow label={m.keywords()} tags={tool.keywords} col="keyword" />}
        {tool.input_file_formats && (
          <TagRow
            label={m.input_formats()}
            tags={tool.input_file_formats}
            col="input_file_formats"
          />
        )}
        {tool.output_file_formats && (
          <TagRow
            label={m.output_formats()}
            tags={tool.output_file_formats}
            col="output_file_formats"
          />
        )}
      </section>

      <section className="mb-4">
        <h2>{m.input_slots()}</h2>
        {tool.input_slots?.length ? (
          tool.input_slots.map((slot, i) => (
            <div
              key={slot.id}
              className={`mb-2 flex flex-row gap-2 ${i === (tool.input_slots?.length ?? 0) - 1 ? "" : "border-b border-gray-200 dark:border-gray-800 pb-1"}`}
            >
              <div className="w-30 sm:w-60 shrink-0 text-ellipsis overflow-hidden text-sm">
                <Tag label={slot.type} col="other" />
                <span className={`${slot.name ? "" : "text-gray-300 dark:text-gray-600"}`}>
                  {slot.name || "—"}
                </span>
              </div>
              <div
                className={`shrink text-sm ${slot.description ? "text-gray-600 dark:text-gray-300" : "text-gray-300 dark:text-gray-600"}`}
              >
                {slot.description || "—"}
              </div>
            </div>
          ))
        ) : (
          <p>{m.no_input_slots_available()}</p>
        )}
      </section>

      <RawBlock header={m.raw_definition()} data={rawDef} loading={rawLoading} />
      <RawBlock header={m.raw_metadata()} data={tool.raw_metadata} />
      <RawBlock header={m.metadata_schema()} data={tool.metadata_schema} />
    </div>
  );
}

function TagRow({ label, tags, col }: { label: string; tags: string[] | null; col: string }) {
  return (
    <dl className="flex gap-2 mb-2 items-baseline">
      <dt className="mb-0 text-sm text-nowrap">{label}</dt>
      <dd>
        <TagList tags={tags} col={col} className="grow" />
      </dd>
    </dl>
  );
}

function RawBlock({ header, data, loading }: { header: string; data: any; loading?: boolean }) {
  return (
    <section className="mb-4 w-full">
      <h2 className="mb-1">{header}</h2>
      <ScrollArea.Root
        className={`${!data || Object.keys(data).length === 0 ? "h-9" : "h-80"} rounded-lg dark:bg-[#0d1117] bg-white`}
      >
        <ScrollArea.Viewport className="h-full">
          <ScrollArea.Content className="p-2">
            {loading ? <Loader /> : <JsonView value={data ?? false} />}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className="w-2 rounded-r-lg bg-gray-200 dark:bg-gray-800">
          <ScrollArea.Thumb className="w-full rounded-lg bg-gray-400 dark:bg-gray-600" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </section>
  );
}
