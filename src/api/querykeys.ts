import type { ToolsSearchParams } from "./types";

/**
 * Centralised query keys
 * Keeps cache invalidation consistent across the app.
 */
export const toolKeys = {
  all: ["tools"] as const,
  lists: () => [...toolKeys.all, "list"] as const,
  list: (params?: ToolsSearchParams) =>
    [
      ...toolKeys.lists(),
      Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v !== undefined)),
    ] as const,
  details: () => [...toolKeys.all, "detail"] as const,
  detail: (id: number) => [...toolKeys.details(), id] as const,
  rawDefinition: (id: number) => [...toolKeys.all, "rawDefinition", id] as const,
};

export const healthKeys = {
  all: ["health"] as const,
};
