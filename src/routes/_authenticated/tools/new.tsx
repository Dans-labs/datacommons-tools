import { createFileRoute } from "@tanstack/react-router";
import ToolForm from "@/components/ToolForm";
import { m } from "@/paraglide/messages";

export const Route = createFileRoute("/_authenticated/tools/new")({
  component: RouteComponent,
  head: () => ({
    meta: [{ title: m.meta_title({ page: m.register_tool() }) }],
  }),
});

function RouteComponent() {
  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 md:p-8 w-full">
      <h1>{m.register_tool()}</h1>
      <p>{m.register_tool_description()}</p>
      <ToolForm />
    </div>
  );
}
