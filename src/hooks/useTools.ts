import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import {
  searchTools,
  searchMyTools,
  getToolById,
  getToolRawDefinition,
  createTool,
  updateTool,
  deleteTool,
  healthCheck,
} from "../api/tools";
import { toolKeys, healthKeys } from "../api/querykeys";
import type {
  ToolOut,
  ToolOutExt,
  ToolCreate,
  ToolUpdate,
  ToolsSearchParams,
  HealthResponse,
} from "../api/types";

export function useHealth() {
  return useQuery<HealthResponse>({
    queryKey: healthKeys.all,
    queryFn: healthCheck,
    staleTime: 30_000,
  });
}

export function useTools(
  params?: ToolsSearchParams,
  options?: Omit<UseQueryOptions<ToolOut[]>, "queryKey" | "queryFn">
) {
  return useQuery<ToolOut[]>({
    queryKey: toolKeys.list(params),
    queryFn: () => searchTools(params),
    staleTime: 60_000,
    ...options,
  });
}
 
export function useMyTools(
  params?: ToolsSearchParams,
  options?: Omit<UseQueryOptions<ToolOut[]>, "queryKey" | "queryFn">
) {
  return useQuery<ToolOut[]>({
    queryKey: [...toolKeys.list(params), "mine"] as const,
    queryFn: () => searchMyTools(params),
    staleTime: 60_000,
    ...options,
  });
}

export function useTool(
  id: number,
  options?: Omit<UseQueryOptions<ToolOutExt>, "queryKey" | "queryFn">
) {
  return useQuery<ToolOutExt>({
    queryKey: toolKeys.detail(id),
    queryFn: () => getToolById(id),
    enabled: !!id,
    ...options,
  });
}

export function useToolRawDefinition(
  id: number,
  options?: Omit<UseQueryOptions<unknown>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: toolKeys.rawDefinition(id),
    queryFn: () => getToolRawDefinition(id),
    enabled: !!id,
    ...options,
  });
}

export function useCreateTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ToolCreate) => createTool(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: toolKeys.lists() });
    },
  });
}

export function useUpdateTool(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ToolUpdate) => updateTool(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: toolKeys.detail(id) });
      qc.invalidateQueries({ queryKey: toolKeys.lists() });
    },
  });
}

export function useDeleteTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTool(id),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: toolKeys.detail(id) });
      qc.invalidateQueries({ queryKey: toolKeys.lists() });
    },
  });
}