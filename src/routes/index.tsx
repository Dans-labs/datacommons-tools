import { createFileRoute } from '@tanstack/react-router'
import type { ToolsSearchParams } from '../api/types';
import { useTools } from '../hooks/useTools';
import { useState } from 'react';
import ToolList from '../components/ToolList';
import Metadata from '../components/Metadata';

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [params, setParams] = useState<ToolsSearchParams>({});
  const { data: tools, isLoading, isError } = useTools(params);
 
  const handleFilter = (key: keyof ToolsSearchParams, value: string) =>
    setParams((prev) => ({ ...prev, [key]: value || undefined }));
  
  return (
    <>
      <Metadata title="Explore all tools" />
      <ToolList 
        title="Explore all tools"
        tools={tools}
        isLoading={isLoading}
        isError={isError}
        handleFilter={handleFilter}
      />
    </>
  );
}
