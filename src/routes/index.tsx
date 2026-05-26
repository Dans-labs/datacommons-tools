import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { ToolsSearchParams } from '../api/types';
import { useTools } from '../hooks/useTools';
import ToolsRoute from '../components/ToolsRoute';

// routes/index.tsx
export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): ToolsSearchParams => ({
    name: search.name as string | undefined,
    input_file_formats: search.input_file_formats as string | undefined,
    output_file_formats: search.output_file_formats as string | undefined,
    tags: search.tags as string | undefined,
  }),
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const handleFilter = (key: keyof ToolsSearchParams, value: string) =>
    navigate({ search: (prev) => ({ ...prev, [key]: value || undefined }), replace: true });

  return <ToolsRoute title="Explore all tools" useToolsHook={useTools} getSearch={Route.useSearch} handleFilter={handleFilter} />;
}