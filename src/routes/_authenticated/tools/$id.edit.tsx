import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useDeleteTool, useTool } from '../../../hooks/useTools';
import ToolForm from '../../../components/ToolForm';
import { enqueueSnackbar } from 'notistack';
import Metadata from '../../../components/Metadata';
import Loader from '../../../components/Loader';
import Error from '../../../components/Error';

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

  if (isLoading) return <Loader />;
  if (isError || !tool) return <Error message="Tool not found." />;
  
  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 md:p-8 w-full">
      <Metadata title={`Edit Tool - ${tool.name}`} />
      <h1>Edit Tool</h1>
      <p>Currently editing: <strong>{tool.name}</strong></p>
      <ToolForm tool={tool} delete={handleDelete} />
    </div>
  )
}
