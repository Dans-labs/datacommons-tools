import { createFileRoute } from '@tanstack/react-router'
import { useMyTools } from '../../../hooks/useTools';
import type { ToolsSearchParams } from '../../../api/types';
import ToolList from '../../../components/ToolList';
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/tools/my-tools')({
  component: RouteComponent,
})

function RouteComponent() {
  const [params, setParams] = useState<ToolsSearchParams>({});
  const { data: tools, isLoading, isError } = useMyTools(params);
 
  const handleFilter = (key: keyof ToolsSearchParams, value: string) =>
    setParams((prev) => ({ ...prev, [key]: value || undefined }));
  
  return (
    <ToolList 
      title="My Tools"
      tools={tools}
      isLoading={isLoading}
      isError={isError}
      handleFilter={handleFilter}
    />
  );
}
