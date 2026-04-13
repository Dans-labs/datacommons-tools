export interface ToolSlot {
  id: string | number;
  name: string;
  type: string;
  description?: string | null;
}

export interface ToolOut {
  id: number;
  uri: string;
  location: string;
  name: string;
  description: string | null;
  license: string | null;
  keywords: string[] | null;
  tags: string[] | null;
  version: string | null;
  types: string[] | null;
  input_file_formats: string[] | null;
  output_file_formats: string[] | null;
  input_file_descriptions: string[] | null;
  output_file_descriptions: string[] | null;
  input_slots: ToolSlot[] | null;
  output_slots: ToolSlot[] | null;
}

export interface ToolOutExt extends ToolOut {
  raw_definition: Record<string, unknown> | null;
  raw_metadata: Record<string, unknown> | null;
  metadata_schema: Record<string, unknown> | null;
  metadata_version: string | null;
  metadata_type: string | null;
  created_at: string;
  updated_at: string | null;
  created_by: string;
}

export interface ToolCreate {
  uri: string;
  name: string;
  version: string;
  description: string;
  types: string[];
  location?: string | null;
  license?: string | null;
  keywords?: string[] | null;
  tags?: string[] | null;
  input_file_formats?: string[] | null;
  output_file_formats?: string[] | null;
  input_file_descriptions?: string[] | null;
  output_file_descriptions?: string[] | null;
  input_slots?: Record<string, unknown>[] | null;
  output_slots?: Record<string, unknown>[] | null;
  raw_definition?: Record<string, unknown> | null;
  raw_metadata?: Record<string, unknown> | null;
  metadata_schema?: Record<string, unknown> | null;
  metadata_version?: string | null;
  metadata_type?: string | null;
}

export interface ToolUpdate {
  types: string[]; // required per schema
  uri?: string | null;
  location?: string | null;
  name?: string | null;
  version?: string | null;
  description?: string | null;
  keywords?: string[] | null;
  tags?: string[] | null;
  input_file_formats?: string[] | null;
  output_file_formats?: string[] | null;
  input_file_descriptions?: string[] | null;
  output_file_descriptions?: string[] | null;
  input_slots?: Record<string, unknown>[] | null;
  output_slots?: Record<string, unknown>[] | null;
  raw_definition?: Record<string, unknown> | null;
  raw_metadata?: Record<string, unknown> | null;
  metadata_schema?: Record<string, unknown> | null;
  metadata_version?: string | null;
  metadata_type?: string | null;
}

export interface ToolsSearchParams {
  name?: string;
  input_format?: string;
  output_format?: string;
  archetype?: string;
}

export interface HealthResponse {
  status: string;
  version?: string;
}