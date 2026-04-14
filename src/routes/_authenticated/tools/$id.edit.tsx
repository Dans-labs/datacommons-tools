import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useDeleteTool, useTool } from '../../../hooks/useTools';
import ToolForm from '../../../components/ToolForm';

export const Route = createFileRoute('/_authenticated/tools/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams();
  const toolId = Number(id);
  const navigate = useNavigate();

  const { data: tool, isLoading, isError } = useTool(toolId);
  const deleteMutation = useDeleteTool();

  console.log(tool)

  const handleDelete = async () => {
    if (!confirm("Delete this tool? This cannot be undone.")) return;
    await deleteMutation.mutateAsync(toolId);
    navigate({ to: "/tools/my-tools" });
  };

  if (isLoading) return <p>Loading…</p>;
  if (isError || !tool) return <p>Tool not found.</p>;
  
  return (
    <div className="max-w-4xl mx-auto px-8 py-8 w-full">
      <h1>Edit Tool</h1>
      <p>Currently editing: <strong>{tool.name}</strong></p>
      <ToolForm tool={tool} delete={handleDelete} />
    </div>
  )
}
