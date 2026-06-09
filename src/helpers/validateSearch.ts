import type { ToolsSearchParams } from "../api/types";

export const validateSearch = (search: Record<string, unknown>): ToolsSearchParams => ({
  name: search.name as string | undefined,
  description: search.description as string | undefined,
  input_format: search.input_format as string | undefined,
  output_format: search.output_format as string | undefined,
  tag: search.tag as string | undefined,
});
