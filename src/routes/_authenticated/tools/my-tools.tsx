import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMyTools } from '../../../hooks/useTools';
import type { ToolsSearchParams } from '../../../api/types';
import ToolsRoute from '../../../components/ToolsRoute';
import { validateSearch } from '../../../helpers/validateSearch';

export const Route = createFileRoute('/_authenticated/tools/my-tools')({
  validateSearch: validateSearch,
  component: () => <RouteComponent />,
})

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const handleFilter = (key: keyof ToolsSearchParams, value: string) =>
    navigate({ search: (prev) => ({ ...prev, [key]: value || undefined }), replace: true });

  return <ToolsRoute 
    title="My Tools" 
    useToolsHook={useMyTools} 
    getSearch={Route.useSearch} 
    handleFilter={handleFilter} />;
}