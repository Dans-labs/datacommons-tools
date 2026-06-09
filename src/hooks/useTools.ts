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
  ToolOut,
} from "../api/types";

export function useHealth() {
  return useQuery<HealthResponse>({
    queryKey: healthKeys.all,
    queryFn: healthCheck,
    staleTime: 30_000,
  });
}

export const LIMIT = 100;

export const toolsQueryFn = ({
  pageParam = 0,
  params,
}: {
  pageParam?: number;
  params?: ToolsSearchParams;
}) =>
  searchTools({ ...params, limit: LIMIT, offset: pageParam as number }).then(
    ({ data, headers }) => ({
      data,
      total: Number(headers.get("x-total-count") ?? 0),
    }),
  );

export const getNextPageParam = (
  lastPage: { data: ToolOut[]; total: number },
  allPages: { data: ToolOut[]; total: number }[],
) => {
  const fetched = allPages.flatMap((p) => p.data).length;
  return fetched < lastPage.total ? fetched : undefined;
};

export function useTools(params?: ToolsSearchParams) {
  return useInfiniteQuery({
    queryKey: toolKeys.list(params),
    queryFn: ({ pageParam }) => toolsQueryFn({ pageParam, params }),
    initialPageParam: 0,
    getNextPageParam,
    staleTime: 60_000,
  });
}

export function useMyTools(params?: ToolsSearchParams) {
  return useInfiniteQuery({
    queryKey: [...toolKeys.list(params), "my-tools"] as const,
    queryFn: ({ pageParam }) =>
      searchMyTools({ ...params, limit: LIMIT, offset: pageParam as number }).then(
        ({ data, headers }) => ({
          data,
          total: Number(headers.get("x-total-count") ?? 0),
        }),
      ),
    initialPageParam: 0,
    getNextPageParam,
    staleTime: 60_000,
  });
}

export function useTool(
  id: number,
  options?: Omit<UseQueryOptions<ToolOutExt>, "queryKey" | "queryFn">,
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
  options?: Omit<UseQueryOptions<unknown>, "queryKey" | "queryFn">,
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
      void qc.invalidateQueries({ queryKey: toolKeys.lists() });
    },
  });
}

export function useUpdateTool(id: number | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ToolUpdate) => {
      // strip body of created_at, updated_at, created_by, and id fields if they exist since they are not accepted by the update endpoint
      const {
        created_at: _created_at,
        updated_at: _updated_at,
        created_by: _created_by,
        id,
        ...updatedBody
      } = body;
      return id ? updateTool(id, updatedBody) : Promise.reject("Invalid ID");
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: id ? toolKeys.detail(id) : [] });
      void qc.invalidateQueries({ queryKey: toolKeys.lists() });
    },
  });
}

export function useDeleteTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTool(id),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: toolKeys.detail(id) });
      void qc.invalidateQueries({ queryKey: toolKeys.lists() });
    },
  });
}
