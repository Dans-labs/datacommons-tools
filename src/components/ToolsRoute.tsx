// components/ToolsRoute.tsx
import type { ToolOut, ToolsSearchParams } from '../api/types';
import ToolList from './ToolList';
import Metadata from './Metadata';

interface ToolsRouteProps {
  title: string;
  useToolsHook: (params: ToolsSearchParams) => { data?: ToolOut[], isLoading: boolean, isError: boolean };
  getSearch: () => ToolsSearchParams;
  handleFilter: (key: keyof ToolsSearchParams, value: string) => void;
}

export default function ToolsRoute({ title, useToolsHook, getSearch, handleFilter }: ToolsRouteProps) {
  const params = getSearch();
  const { data: tools, isLoading, isError } = useToolsHook(params);

  return (
    <>
      <Metadata title={title} />
      <ToolList title={title} tools={tools} isLoading={isLoading} isError={isError} handleFilter={handleFilter} searchParams={params} />
    </>
  );
}