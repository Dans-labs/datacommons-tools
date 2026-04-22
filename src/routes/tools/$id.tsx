import { createFileRoute, Link } from '@tanstack/react-router'
import { useTool, useToolRawDefinition } from '../../hooks/useTools';
import { Button, OutlineButton } from '../../components/Button';
import { Tag, TagList } from '../../components/Tags';
import JsonView from '@uiw/react-json-view';
import { githubDarkTheme } from '@uiw/react-json-view/githubDark';
import { githubLightTheme } from '@uiw/react-json-view/githubLight';
import { useAuth } from "react-oidc-context";
import Loader from '../../components/Loader';
import useIsDark from '../../hooks/useIsDark';
import Metadata from '../../components/Metadata';
import Error from '../../components/Error';

export const Route = createFileRoute('/tools/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams();
  const toolId = Number(id);
  const auth = useAuth();

  const { data: tool, isLoading, isError } = useTool(toolId);
  const { data: rawDef, isLoading: rawLoading } = useToolRawDefinition(toolId);

  if (isLoading) return <div className="p-20"><Loader /></div>;
  if (isError || !tool) return <Error message="Tool not found." />;
  
  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 md:p-8 w-full">
      <Metadata title={tool.name} />
      <h1>{tool.name}</h1>
      <section className="mb-4 flex flex-wrap items-start gap-4">
        <div>
          <span className="text-gray-600 dark:text-gray-300 text-sm block">Version: {tool.version}</span>
          <span className="text-gray-600 dark:text-gray-300 text-sm block">License: {tool.license ?? "No license"}</span>
          <span className="text-gray-600 dark:text-gray-300 text-sm block">Created by: {tool.created_by}</span>
          <span className="text-gray-600 dark:text-gray-300 text-sm block">Created at: {new Date(tool.created_at).toLocaleDateString()}</span>
          {tool.updated_at &&<span className="text-gray-600 dark:text-gray-300 text-sm block">Updated at: {new Date(tool.updated_at).toLocaleDateString()}</span>}
        </div>
        <div className="flex gap-2 ml-auto">
          {tool.location && (
            <Button className="">
              <a
                href={tool.location}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost small"
              >
                Open location
              </a>
            </Button>
          )}
          {
            auth.isAuthenticated && 
            auth.user?.profile?.sub === tool.created_by &&
            <OutlineButton className="mr-2"><Link to={`/tools/$id/edit`} params={{ id: String(toolId) }}>Edit</Link></OutlineButton>
          }
        </div>
      </section>
 
      <section className="mb-6">
        <p>{tool.description}</p>
      </section>
 
      <section className="mb-4 max-w-full">
        {tool.types && <TagRow label="Types" tags={tool.types} col="archetype" />}
        {tool.tags && <TagRow label="Tags" tags={tool.tags} col="tags" />}
        {tool.keywords && <TagRow label="Keywords" tags={tool.keywords} col="keyword" />}
        {tool.input_file_formats && <TagRow label="Input File Formats" tags={tool.input_file_formats} col="input_format" />}
        {tool.output_file_formats && <TagRow label="Output File Formats" tags={tool.output_file_formats} col="output_format" />}
      </section>

      <section className="mb-4">
        <h2>Input slots</h2>
        {tool.input_slots?.length ? (
          tool.input_slots.map((slot, i) => (
            <div key={slot.id} className={`mb-2 flex flex-row gap-2 ${i === (tool.input_slots?.length ?? 0) - 1 ? "" : "border-b border-gray-200 dark:border-gray-800 pb-1"}`}>
              <h6 className="w-30 sm:w-50 shrink-0">
                <Tag label={slot.type} col="other" />
                {slot.name}
              </h6>
              <div className="shrink text-gray-600 dark:text-gray-300 text-sm">{slot.description || "-"}</div>
            </div>
          ))
        ) : (
          <p>No input slots available.</p>
        )}
      </section>
  
      <RawBlock header="Raw Definition" data={rawDef} loading={rawLoading} />
      <RawBlock header="Raw Metadata" data={tool.raw_metadata} />
      <RawBlock header="Metadata Schema" data={tool.metadata_schema} />

    </div>
  )
}

function TagRow({ label, tags, col }: { label: string; tags: string[] | null; col: string }) {
  return (
    <div className="flex gap-2 mb-2 items-baseline">
      <h6 className="mb-0">{label}</h6>
      <TagList tags={tags} col={col} className="grow" />
    </div>
  );
}

function RawBlock({ header, data, loading }: { header: string; data: any; loading?: boolean }) {
  const isDark = useIsDark();
  return (
    <section className="mb-4 w-full">
      <h2 className="mb-1">{header}</h2>
      <div className="overflow-auto max-h-96 bg-linear-to-b rounded-lg dark:bg-[#0d1117] bg-white p-4">
        {loading ? 
        <Loader /> : 
        <JsonView value={data ?? false} style={isDark ? githubDarkTheme : githubLightTheme} />
        }
      </div>
    </section>
  )
}