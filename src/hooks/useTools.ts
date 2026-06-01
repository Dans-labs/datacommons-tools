import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  useInfiniteQuery,
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

const LIMIT = 100;

export function useTools(params?: ToolsSearchParams) {
  return useInfiniteQuery({
    queryKey: toolKeys.list(params),
    queryFn: ({ pageParam = 0 }) =>
      searchTools({ ...params, limit: LIMIT, offset: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const total = Number(lastPage.headers.get("x-total-count"));
      const fetched = allPages.flatMap((p) => p.data).length;
      return fetched < total ? fetched : undefined;
    },
    staleTime: 60_000,
  });
}
 
export function useMyTools(params?: ToolsSearchParams) {
  return useInfiniteQuery({
    queryKey: [...toolKeys.list(params), "mine"] as const,
    queryFn: ({ pageParam = 0 }) =>
      searchMyTools({ ...params, limit: LIMIT, offset: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const total = Number(lastPage.headers.get("x-total-count"));
      const fetched = allPages.flatMap((p) => p.data).length;
      return fetched < total ? fetched : undefined;
    },
    staleTime: 60_000,
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
    mutationFn: (body: ToolCreate) => {
      return createTool(body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: toolKeys.lists() });
    },
  });
}

export function useUpdateTool(id: number | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ToolUpdate) => {
      // strip body of created_at, updated_at, created_by, and id fields if they exist since they are not accepted by the update endpoint
      const { created_at, updated_at, created_by, id, ...updatedBody } = body;
      return id ? updateTool(id, updatedBody) : Promise.reject("Invalid ID")
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: id ? toolKeys.detail(id) : [] });
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