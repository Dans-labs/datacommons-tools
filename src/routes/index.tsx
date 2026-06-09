import { createFileRoute, useNavigate } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import type { ToolsSearchParams } from "@/api/types";
import { toolsQueryFn, getNextPageParam, useTools } from "@/hooks/useTools";
import ToolsRoute from "@/components/ToolsRoute";
import { validateSearch } from "@/helpers/validateSearch";
import { toolKeys } from "@/api/querykeys";
import { m } from "@/paraglide/messages";

// routes/index.tsx
export const Route = createFileRoute("/")({
  validateSearch: validateSearch,
  component: () => <RouteComponent />,
  loader: async ({ context, location: { search } }) => {
    const { queryClient } = context as { queryClient: QueryClient };
    await queryClient.prefetchInfiniteQuery({
      queryKey: toolKeys.list(search),
      queryFn: ({ pageParam }: { pageParam?: number }) =>
        toolsQueryFn({ pageParam, params: search }),
      initialPageParam: 0,
      getNextPageParam,
      pages: 1, // Only prefetch the first page on initial load for performance
    });
  },
  head: () => ({
    meta: [{ title: m.meta_title({ page: m.all_tools() }) }],
  }),
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const handleFilter = (key: keyof ToolsSearchParams, value: string) =>
    navigate({ search: (prev) => ({ ...prev, [key]: value || undefined }), replace: true });

  return (
    <ToolsRoute
      title={m.all_tools()}
      useToolsHook={useTools}
      getSearch={Route.useSearch}
      handleFilter={handleFilter}
    />
  );
}
