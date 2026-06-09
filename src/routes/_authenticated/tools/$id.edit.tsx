import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDeleteTool, useTool } from "@/hooks/useTools";
import ToolForm from "@/components/ToolForm";
import { toastManager } from "@/components/Toast";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_authenticated/tools/$id/edit")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: m.meta_title({ page: m.edit_tool() }) }],
  }),
});

function RouteComponent() {
  const { id } = Route.useParams();
  const toolId = Number(id);
  const navigate = useNavigate();

  const { data: tool, isLoading, isError } = useTool(toolId);
  const deleteMutation = useDeleteTool();

  const handleDelete = async () => {
    deleteMutation.mutate(toolId, {
      onSuccess: () => {
        toastManager.add({
          title: m.success(),
          description: m.tool_deleted_successfully(),
          data: { variant: "success" },
        });
        void navigate({ to: "/tools/my-tools" });
      },
      onError: (e: any) => {
        toastManager.add({
          title: m.error(),
          description: m.failed_to_delete({ error: e?.message ?? m.unknown_error() }),
          data: { variant: "error" },
        });
      },
    });
  };

  if (isLoading) return <Loader />;
  if (isError || !tool) return <Error message={m.not_found()} />;

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 md:p-8 w-full">
      <h1>{m.edit_tool()}</h1>
      <p>{m.currently_editing({ name: tool.name })}</p>
      <ToolForm tool={tool} delete={handleDelete} />
    </div>
  );
}
