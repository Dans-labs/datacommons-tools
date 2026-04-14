import { createFileRoute, Link } from '@tanstack/react-router'
import { useTool, useToolRawDefinition } from '../../hooks/useTools';
import { Button, OutlineButton } from '../../components/Button';
import { TagList } from '../../components/Tags';
import JsonView from '@uiw/react-json-view';
import { githubDarkTheme } from '@uiw/react-json-view/githubDark';
import { useAuth } from "react-oidc-context";
import Loader from '../../components/Loader';

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
  if (isError || !tool) return <div className="p-20">Tool not found.</div>;
  
  return (
    <div className="max-w-4xl mx-auto px-8 py-8 w-full">
      <section className="mb-4 flex flex-wrap items-start gap-4">
        <h1>{tool.name}</h1>
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
          {auth.isAuthenticated && <OutlineButton className="mr-2"><Link to={`/tools/$id/edit`} params={{ id: String(toolId) }}>Edit</Link></OutlineButton>}
        </div>
      </section>
 
      <div className="mb-4">
        <span className="text-gray-600 dark:text-gray-300 text-sm block">Version: {tool.version}</span>
        <span className="text-gray-600 dark:text-gray-300 text-sm block">License: {tool.license ?? "No license"}</span>
        <span className="text-gray-600 dark:text-gray-300 text-sm block">Created by: {tool.created_by}</span>
        <span className="text-gray-600 dark:text-gray-300 text-sm block">Created at: {new Date(tool.created_at).toLocaleDateString()}</span>
        {tool.updated_at &&<span className="text-gray-600 dark:text-gray-300 text-sm block">Updated at: {new Date(tool.updated_at).toLocaleDateString()}</span>}
      </div>
 
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
          tool.input_slots.map((slot) => (
            <div key={slot.id} className="mb-2">
              <h5 className="mb-0">{slot.name}</h5>
              <span className="text-gray-600 dark:text-gray-300 text-xs block">Type: {slot.type}</span>
              {slot.description && <p>{slot.description}</p>}
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
  return (
    <section className="mb-4 w-full">
      <h2 className="mb-1">{header}</h2>
      <div className="overflow-auto max-h-96 bg-linear-to-b rounded-lg bg-[#0d1117] p-4">
        {loading ? <p>Loading…</p> : <JsonView value={data} style={githubDarkTheme} />}
      </div>
    </section>
  )
}