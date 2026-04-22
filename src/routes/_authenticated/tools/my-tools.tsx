import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMyTools } from '../../../hooks/useTools';
import type { ToolsSearchParams } from '../../../api/types';
import ToolsRoute from '../../../components/ToolsRoute';

export const Route = createFileRoute('/_authenticated/tools/my-tools')({
  validateSearch: (search: Record<string, unknown>): ToolsSearchParams => ({
    name: search.name as string | undefined,
    input_format: search.input_format as string | undefined,
    output_format: search.output_format as string | undefined,
    archetype: search.archetype as string | undefined,
  }),
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const handleFilter = (key: keyof ToolsSearchParams, value: string) =>
    navigate({ search: (prev) => ({ ...prev, [key]: value || undefined }), replace: true });

  return <ToolsRoute title="My Tools" useToolsHook={useMyTools} getSearch={Route.useSearch} handleFilter={handleFilter} />;
}