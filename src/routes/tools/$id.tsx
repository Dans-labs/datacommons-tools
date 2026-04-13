import { createFileRoute } from '@tanstack/react-router'
import { useTool, useToolRawDefinition } from '../../hooks/useTools';
import { Tags } from '../../components/Box';
import { Button } from '../../components/Button';

export const Route = createFileRoute('/tools/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams();
  const toolId = Number(id);

  const { data: tool, isLoading, isError } = useTool(toolId);
  const { data: rawDef, isLoading: rawLoading } = useToolRawDefinition(toolId);

  if (isLoading) return <p>Loading…</p>;
  if (isError || !tool) return <p>Tool not found.</p>;
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1>{tool.name}</h1>

      <section className="mb-4">
        <Button className="mr-2">Edit</Button>
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
      </section>
 
      <div className="mb-4">
        <span className="text-gray-600 dark:text-gray-300 text-sm block">Version: {tool.version}</span>
        <span className="text-gray-600 dark:text-gray-300 text-sm block">License: {tool.license ?? "No license"}</span>
        <span className="text-gray-600 dark:text-gray-300 text-sm block">Created by: {tool.created_by}</span>
        <span className="text-gray-600 dark:text-gray-300 text-sm block">Created at: {new Date(tool.created_at).toLocaleDateString()}</span>
        {tool.updated_at &&<span className="text-gray-600 dark:text-gray-300 text-sm block">Updated at: {new Date(tool.updated_at).toLocaleDateString()}</span>}
      </div>
 
      <section className="">
        <p>{tool.description}</p>
      </section>
 
      <section className="mb-4">
        {tool.types && 
          <Tags label="Types" tags={tool.types} color="green" />
        }
        {tool.tags && 
          <Tags label="Tags" tags={tool.tags} color="blue" />
        } 
        {tool.keywords &&
          <Tags label="Keywords" tags={tool.keywords} color="orange" />
        }
        {tool.input_file_formats &&
          <Tags label="Input Formats" tags={tool.input_file_formats} color="orange" />
        }
        {tool.output_file_formats && 
          <Tags label="Output Formats" tags={tool.output_file_formats} color="indigo" />
        }
      </section>

      <section className="mb-4">
        <h2>Input slots</h2>
        {tool.input_slots?.length ? (
          tool.input_slots.map((slot) => (
            <div key={slot.id} className="mb-2">
              <h5 className="mb-0">{slot.name}</h5>
              <span className="text-gray-600 dark:text-gray-300 text-sm block">Type: {slot.type}</span>
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

function RawBlock({ header, data, loading }: { header: string; data: any; loading?: boolean }) {
  return (
    <section className="mb-4">
      <h2 className="mb-1">{header}</h2>
      <div className="overflow-auto max-h-96 bg-linear-to-b from-indigo-500/10 to-primary/10 p-4 rounded-lg">
        {loading ? <p>Loading…</p> : <pre className="">{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </section>
  )
}