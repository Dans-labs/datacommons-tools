import { createFileRoute, redirect } from '@tanstack/react-router'
import { useDeleteTool, useTool, useToolRawDefinition, useUpdateTool } from '../../hooks/useTools';
import { useState } from 'react';

export const Route = createFileRoute('/tools/$id')({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) throw redirect({ to: "/login" });
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams();
  const toolId = Number(id);

  const { data: tool, isLoading, isError } = useTool(toolId);
  const { data: rawDef, isLoading: rawLoading } = useToolRawDefinition(toolId);
  const updateMutation = useUpdateTool(toolId);
  const deleteMutation = useDeleteTool();

  console.log(tool)

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [showRaw, setShowRaw] = useState(false);

  const startEdit = () => {
    setEditName(tool?.name ?? "");
    setEditDesc(tool?.description ?? "");
    setEditing(true);
  };

  const saveEdit = () => {
    if (!tool) return;
    updateMutation.mutate(
      { types: tool.types ?? [], name: editName, description: editDesc },
      { onSuccess: () => console.log('edited') }
    );
  };

  const handleDelete = async () => {
    if (!confirm("Delete this tool? This cannot be undone.")) return;
    await deleteMutation.mutateAsync(toolId);
    // navigate({ to: "/" });
  };

  if (isLoading) return <p>Loading…</p>;
  if (isError || !tool) return <p>Tool not found.</p>;
  
  return (
    <div className="">
      <div className="">
        {editing ? (
          <input
            className=""
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
        ) : (
          <h1>{tool.name}</h1>
        )}
        <div className="">
          {editing ? (
            <>
              <button
                className=""
                onClick={saveEdit}
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving…" : "Save"}
              </button>
              <button className="" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="" onClick={startEdit}>Edit</button>
              <button
                className=""
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>
 
      <div className="">
        <span className="">{tool.version}</span>
        <span className="">{tool.license ?? "No license"}</span>
        <span className="">by {tool.created_by}</span>
        <span className="">{new Date(tool.created_at).toLocaleDateString()}</span>
      </div>
 
      <section className="">
        <h2>Description</h2>
        {editing ? (
          <textarea
            className=""
            rows={4}
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
          />
        ) : (
          <p>{tool.description}</p>
        )}
      </section>
 
      <section className="">
        <h2>Types & Tags</h2>
        <div className="">
          {tool.types?.map((t) => <span key={t} className="">{t}</span>)}
          {tool.tags?.map((t) => <span key={t} className="">{t}</span>)}
          {tool.keywords?.map((k) => <span key={k} className="">{k}</span>)}
        </div>
      </section>
 
      <section className="">
        <div>
          <h2>Inputs</h2>
          <p className="">Formats: {tool.input_file_formats?.join(", ") || "—"}</p>
          {tool.input_file_descriptions?.map((d, i) => <p key={i}>{d}</p>)}
          {tool.input_slots?.length ? (
            <pre className="">{JSON.stringify(tool.input_slots, null, 2)}</pre>
          ) : null}
        </div>
        <div>
          <h2>Outputs</h2>
          <p className="">Formats: {tool.output_file_formats?.join(", ") || "—"}</p>
          {tool.output_file_descriptions?.map((d, i) => <p key={i}>{d}</p>)}
          {tool.output_slots?.length ? (
            <pre className="">{JSON.stringify(tool.output_slots, null, 2)}</pre>
          ) : null}
        </div>
      </section>
 
      <section className="">
        <div className="">
          <h2>Raw Definition</h2>
          <button className="" onClick={() => setShowRaw((v) => !v)}>
            {showRaw ? "Hide" : "Show"}
          </button>
        </div>
        {showRaw &&
          (rawLoading ? (
            <p>Loading…</p>
          ) : (
            <pre className="">{JSON.stringify(rawDef, null, 2)}</pre>
          ))}
      </section>
 
      <div className="">
        <span className="">URI</span>
        <code>{tool.uri}</code>
        {tool.location && (
          <a
            href={tool.location}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost small"
          >
            Open location
          </a>
        )}
      </div>
    </div>
  )
}
