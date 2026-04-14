import { Input, AutocompleteInput } from "./Input";
import { Button } from "./Button";
import { useState } from "react";
import { useFileExtensions, useLicenses } from "../hooks/useLists";
import { useCreateTool, useUpdateTool } from "../hooks/useTools";
import type { ToolCreate, ToolOutExt } from "../api/types";
import { useNavigate } from "@tanstack/react-router";
import { enqueueSnackbar } from 'notistack'

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
      enqueueSnackbar('Form could not be submitted. Please fill in all required fields.', { variant: 'error' });
      return;
    }
  
    if (tool) {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          enqueueSnackbar('Tool updated successfully!', { variant: 'success' });
          navigate({ to: `/tools/${tool.id}` })
        },
        onError: (e: any) => {
          enqueueSnackbar('Failed to update tool.', { variant: 'error' });
          setError(e?.message ?? "Failed to update tool.");
        },
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          enqueueSnackbar('Tool created successfully!', { variant: 'success' });
          navigate({ to: `/tools/my-tools` });
        },
        onError: (e: any) => {
          enqueueSnackbar('Failed to create tool.', { variant: 'error' });
          setError(e?.message ?? "Failed to create tool.");
        },
      });
    }
  };

  const { data: fileExtensions, isLoading: fileExtensionsLoading, error: fileExtensionsError } = useFileExtensions();
  const { data: licenses, isLoading: licensesLoading, error: licensesError } = useLicenses();

  return (
    <>
      {error && 
        <div className="bg-red-500 rounded-xl px-4 py-3 mb-6">
          Error! {error}
        </div>
      }
  
      <div className="">
        <h5 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-200 mb-4 mt-6">Identity</h5>
        <div className="mb-3">
          <Input label="Name" value={form.name} onChange={set("name")} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3 items-start">
          <Input label="URI" value={form.uri} onChange={set("uri")} />
          <Input label="Location (URL)" value={form.location ?? ""} onChange={set("location")} />
          <Input label="Version" value={form.version} onChange={set("version")} />
          <AutocompleteInput label="License" value={form.license ?? ""} onChange={(v) => setForm((p) => ({ ...p, license: v as string }))} options={licenses} loading={licensesLoading} error={licensesError?.message} />
        </div>

        <h5 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-200 mb-4 mt-6">Details</h5>
        <div className="mb-3">
          <Input label="Description" type="textarea" value={form.description} onChange={set("description")} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3 items-start">
          <AutocompleteInput label="Tags" multiple freeSolo value={tagsInput} onChange={(v) => setTagsInput(v as string[])} />
          <AutocompleteInput label="Keywords" multiple freeSolo value={keywordsInput} onChange={(v) => setKeywordsInput(v as string[])} />
        </div>

        <h5 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-200 mb-4 mt-6">Formats and types</h5>
        <div className="grid grid-cols-2 gap-3 mb-3 items-start">
          <AutocompleteInput label="Input Formats" multiple freeSolo value={inputFormatsInput} onChange={(v) => setInputFormatsInput(v as string[])} options={fileExtensions} loading={fileExtensionsLoading} error={fileExtensionsError?.message} />
          <AutocompleteInput label="Output Formats" multiple freeSolo value={outputFormatsInput} onChange={(v) => setOutputFormatsInput(v as string[])} options={fileExtensions} loading={fileExtensionsLoading} error={fileExtensionsError?.message} />
          <AutocompleteInput label="Types" multiple freeSolo value={typesInput} onChange={(v) => setTypesInput(v as string[])} />
        </div>
      </div>
  
      <div className="flex justify-end mt-8">
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