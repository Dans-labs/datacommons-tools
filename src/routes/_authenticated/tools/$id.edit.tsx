import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useDeleteTool, useTool } from '../../../hooks/useTools';
import ToolForm from '../../../components/ToolForm';
import { enqueueSnackbar } from 'notistack';

export const Route = createFileRoute('/_authenticated/tools/$id/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams();
  const toolId = Number(id);
  const navigate = useNavigate();

  const { data: tool, isLoading, isError } = useTool(toolId);
  const deleteMutation = useDeleteTool();

  const handleDelete = async () => {
    if (!confirm("Delete this tool? This cannot be undone.")) return;
    deleteMutation.mutate(toolId, {
      onSuccess: () => {
        enqueueSnackbar('Tool deleted successfully!', { variant: 'success' });
        navigate({ to: "/tools/my-tools" });
      },
      onError: (e: any) => {
        enqueueSnackbar(`Failed to delete tool: ${e?.message ?? "Unknown error"}`, { variant: 'error' });
      },
    });
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
