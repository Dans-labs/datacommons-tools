import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { ToolsSearchParams } from '../api/types';
import { useTools } from '../hooks/useTools';
import ToolsRoute from '../components/ToolsRoute';
import { validateSearch } from '../helpers/validateSearch';

// routes/index.tsx
export const Route = createFileRoute('/')({
  validateSearch: validateSearch,
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const handleFilter = (key: keyof ToolsSearchParams, value: string) =>
    navigate({ search: (prev) => ({ ...prev, [key]: value || undefined }), replace: true });

  return <ToolsRoute 
    title="Explore all tools" 
    useToolsHook={useTools} 
    getSearch={Route.useSearch} 
    handleFilter={handleFilter} />;
}