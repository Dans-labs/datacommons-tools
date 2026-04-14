import { Input, AutocompleteInput } from "./Input";
import { Button } from "./Button";
import { useState } from "react";
import { useFileExtensions } from "../hooks/useLists";
import { useCreateTool, useUpdateTool } from "../hooks/useTools";
import type { ToolCreate, ToolOutExt } from "../api/types";
import { useNavigate } from "@tanstack/react-router";

const BLANK: ToolCreate = {
  uri: "",
  name: "",
  version: "",
  description: "",
  types: [],
  location: "",
  license: "",
  keywords: [],
  tags: [],
  input_file_formats: [],
  output_file_formats: [],
};

export default function ToolForm({ tool, delete: handleDelete }: { tool?: ToolOutExt; delete?: () => void }) {
  const navigate = useNavigate();
  const createMutation = useCreateTool();
  const updateMutation = useUpdateTool(tool?.id);
  const [form, setForm] = useState<ToolCreate>((tool as ToolCreate) ?? BLANK);
  const [typesInput, setTypesInput] = useState<string[]>(tool?.types ?? []);
  const [tagsInput, setTagsInput] = useState<string[]>(tool?.tags ?? []);
  const [keywordsInput, setKeywordsInput] = useState<string[]>(tool?.keywords ?? []);
  const [inputFormatsInput, setInputFormatsInput] = useState<string[]>(tool?.input_file_formats ?? []);
  const [outputFormatsInput, setOutputFormatsInput] = useState<string[]>(tool?.output_file_formats ?? []);
  const [error, setError] = useState<string | null>(null);
  
  const set =
    (key: keyof ToolCreate) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
  
  const handleSubmit = () => {
    setError(null);
    const payload: ToolCreate = {
      ...form,
      types: typesInput,
      tags: tagsInput,
      keywords: keywordsInput,
      input_file_formats: inputFormatsInput,
      output_file_formats: outputFormatsInput,
    };
  
    if (
      !payload.uri ||
      !payload.name ||
      !payload.version ||
      !payload.description ||
      !payload.types.length
    ) {
      setError(
        "URI, name, version, description and at least one type are required."
      );
      return;
    }
  
    if (tool) {
      updateMutation.mutate(payload, {
        onSuccess: () => navigate({ to: `/tools/${tool.id}` }),
        onError: (e: any) =>
          setError(e?.message ?? "Failed to update tool."),
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => navigate({ to: `/tools/my-tools` }),
        onError: (e: any) =>
          setError(e?.message ?? "Failed to create tool."),
      });
    }
  };

  const { data: fileExtensions, isLoading: fileExtensionsLoading, error: fileExtensionsError } = useFileExtensions();

  return (
    <>
      {error && 
        <div className="bg-red-500 rounded-xl px-4 py-3 max-w-200 mb-6">
          Error! {error}
        </div>
      }
  
      <div className="">
        <div className="max-w-200 mb-3">
          <Input label="Name" value={form.name} onChange={set("name")} placeholder="My Genomic Tool" />
        </div>
        <div className="max-w-200 mb-3">
          <Input label="URI" value={form.uri} onChange={set("uri")} placeholder="https://bio.tools/my-tool" />
        </div>
        <div className="max-w-200 grid grid-cols-2 gap-3 mb-3">
          <Input label="Version" value={form.version} onChange={set("version")} placeholder="1.0.0" />
          <Input label="License" value={form.license ?? ""} onChange={set("license")} placeholder="MIT" />
        </div>
        <div className="max-w-200 mb-3">
          <Input label="Description" type="textarea" value={form.description} onChange={set("description")} />
        </div>
        <div className="max-w-200 mb-6">
          <Input label="Location (URL)" value={form.location ?? ""} onChange={set("location")} />
        </div>

        <p className="">Select from a list or enter values manually</p>
        <div className="max-w-200 grid grid-cols-2 gap-3 mb-3">
          <AutocompleteInput label="Tags" multiple freeSolo value={tagsInput} onChange={setTagsInput} />
          <AutocompleteInput label="Keywords" multiple freeSolo value={keywordsInput} onChange={setKeywordsInput} />
          <AutocompleteInput label="Input Formats" multiple freeSolo value={inputFormatsInput} onChange={setInputFormatsInput} options={fileExtensions} loading={fileExtensionsLoading} error={fileExtensionsError?.message} />
          <AutocompleteInput label="Output Formats" multiple freeSolo value={outputFormatsInput} onChange={setOutputFormatsInput} options={fileExtensions} loading={fileExtensionsLoading} error={fileExtensionsError?.message} />
          <AutocompleteInput label="Types" multiple freeSolo value={typesInput} onChange={setTypesInput} />
        </div>
      </div>
  
      <div className="flex mt-8">
        <Button
          className=""
          onClick={handleSubmit}
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          {
            createMutation.isPending ? 
            "Registering…" : 
            updateMutation.isPending ?
            "Updating…" :
            tool ? "Update Tool" :
            "Register Tool"
          }
        </Button>
        {tool && handleDelete && (
          <Button
            className="ml-4 bg-linear-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500"
            onClick={handleDelete}
          >
            Delete Tool
          </Button>
        )}
      </div>
    </>
  )
}