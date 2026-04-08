import { apiFetch } from "./client";
import type {
  ToolOut,
  ToolOutExt,
  ToolCreate,
  ToolUpdate,
  ToolsSearchParams,
  HealthResponse
} from "./types";

const qs = (params?: Record<string, string | undefined>) => {
  if (!params) return "";
  const s = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
  ).toString();
  return s ? `?${s}` : "";
};

export const healthCheck = () =>
  apiFetch<HealthResponse>("/api/v1/health");

export const authCheck = () =>
  apiFetch("/api/v1/auth");

export const searchTools = (params?: ToolsSearchParams) =>
  apiFetch<ToolOut[]>(`/api/v1/tools/${qs(params as Record<string, string | undefined>)}`, {}, false);

export const searchMyTools = (params?: ToolsSearchParams) =>
  apiFetch<ToolOut[]>(`/api/v1/tools/${qs(params as Record<string, string | undefined>)}`);

export const createTool = (body: ToolCreate) =>
  apiFetch("/api/v1/tools/", { method: "POST", body: JSON.stringify(body) });

export const getToolById = (id: number) =>
  apiFetch<ToolOutExt>(`/api/v1/tools/${id}`);

export const getToolRawDefinition = (id: number) =>
  apiFetch(`/api/v1/tools/${id}/raw_definition`);

export const updateTool = (id: number, body: ToolUpdate) =>
  apiFetch(`/api/v1/tools/${id}`, { method: "PATCH", body: JSON.stringify(body) });

export const deleteTool = (id: number) =>
  apiFetch(`/api/v1/tools/${id}`, { method: "DELETE" });