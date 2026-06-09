import type { ToolOut, ToolsSearchParams } from "@/api/types";
import ToolList from "./ToolList";
import type { UseInfiniteQueryResult, InfiniteData } from "@tanstack/react-query";

type PageData = { data: ToolOut[]; total: number };

interface ToolsRouteProps {
  title: string;
  useToolsHook: (params: ToolsSearchParams) => UseInfiniteQueryResult<InfiniteData<PageData>>;
  getSearch: () => ToolsSearchParams;
  handleFilter: (key: keyof ToolsSearchParams, value: string) => void;
}

export default function ToolsRoute({
  title,
  useToolsHook,
  getSearch,
  handleFilter,
}: ToolsRouteProps) {
  const params = getSearch();
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useToolsHook(params);

  const tools = data?.pages.flatMap((p) => p.data);
  const total = data?.pages[0]?.total ?? 0;

  return (
    <ToolList
      title={title}
      tools={tools}
      total={total}
      isLoading={isLoading}
      isError={isError}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      handleFilter={handleFilter}
      searchParams={params}
    />
  );
}
