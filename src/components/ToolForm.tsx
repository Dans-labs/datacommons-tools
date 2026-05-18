import { Input, ComboboxInput, MultiComboboxInput, TagInput } from "./Input";
import { Button } from "./Button";
import { useState } from "react";
import { useFileExtensions, useLicenses } from "../hooks/useLists";
import { useCreateTool, useUpdateTool } from "../hooks/useTools";
import type { ToolCreate, ToolOutExt } from "../api/types";
import { useNavigate } from "@tanstack/react-router";
import { toastManager } from './Toast';
import { Form } from "@base-ui/react/form";
import { Field } from "@base-ui/react/field";

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

const REQUIRED_ERROR = "URI, name, version, description and at least one type are required.";

export default function ToolForm({
  tool,
  delete: handleDelete,
}: {
  tool?: ToolOutExt;
  delete?: () => void;
}) {
  const navigate = useNavigate();
  const createMutation = useCreateTool();
  const updateMutation = useUpdateTool(tool?.id);
  const [form, setForm] = useState<ToolCreate>((tool as ToolCreate) ?? BLANK);
  const [typesInput, setTypesInput] = useState<string[]>(tool?.types ?? []);
  const [tagsInput, setTagsInput] = useState<string[]>(tool?.tags ?? []);
  const [keywordsInput, setKeywordsInput] = useState<string[]>(tool?.keywords ?? []);
  const [inputFormatsInput, setInputFormatsInput] = useState<string[]>(tool?.input_file_formats ?? []);
  const [outputFormatsInput, setOutputFormatsInput] = useState<string[]>(tool?.output_file_formats ?? []);
  // Server-side errors keyed by field name, fed into <Form errors={...}>
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const set =
    (key: keyof ToolCreate) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

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
      // Surface inline field errors via Form's errors prop
      setErrors({
        uri:         !payload.uri         ? [REQUIRED_ERROR] : [],
        name:        !payload.name        ? [REQUIRED_ERROR] : [],
        version:     !payload.version     ? [REQUIRED_ERROR] : [],
        description: !payload.description ? [REQUIRED_ERROR] : [],
        types:       !payload.types.length ? ["At least one type is required."] : [],
      });
      toastManager.add({
        title: "Form could not be submitted. Please fill in all required fields.",
        data: { variant: "error" },
      });
      return;
    }

    if (tool) {
      updateMutation.mutate(payload, {
        onSuccess: () => {
          toastManager.add({ 
            title: "Tool updated successfully!", data: { variant: "success" } });
          navigate({ to: `/tools/${tool.id}` });
        },
        onError: (e: any) => {
          toastManager.add({ title: "Failed to update tool.", data: { variant: "error" } });
          setErrors({ _form: [e?.message ?? "Failed to update tool."] });
        },
      });
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toastManager.add({ title: "Tool created successfully!", data: { variant: "success" } });
          navigate({ to: `/tools/my-tools` });
        },
        onError: (e: any) => {
          toastManager.add({ title: "Failed to create tool.", data: { variant: "error" } });
          setErrors({ _form: [e?.message ?? "Failed to create tool."] });
        },
      });
    }
  };

  const { data: fileExtensions, isLoading: fileExtensionsLoading, error: fileExtensionsError } = useFileExtensions();
  const { data: licenses, isLoading: licensesLoading, error: licensesError } = useLicenses();

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form errors={errors} onSubmit={handleSubmit}>
      {/* Top-level server error (e.g. network failure) */}
      {errors._form && (
        <div className="bg-red-700 rounded-lg px-4 py-3 mb-6 text-white">
          Error! {errors._form[0]}
        </div>
      )}

      <h5 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-200 mb-4 mt-6">
        Identity
      </h5>

      <div className="mb-3">
        <Field.Root name="name">
          <Input label="Name" value={form.name} onChange={set("name")} />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 items-start">
        <Field.Root name="uri">
          <Input label="URI" value={form.uri} onChange={set("uri")} />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>

        <Field.Root name="location">
          <Input label="Location (URL)" value={form.location ?? ""} onChange={set("location")} />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>

        <Field.Root name="version">
          <Input label="Version" value={form.version} onChange={set("version")} />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>

        <Field.Root name="license">
          <ComboboxInput
            label="License"
            value={form.license ?? ""}
            onChange={(v) => setForm((p) => ({ ...p, license: v as string }))}
            options={licenses}
            loading={licensesLoading}
            error={licensesError?.message}
          />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>
      </div>

      <h5 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-200 mb-4 mt-6">
        Details
      </h5>

      <div className="mb-3">
        <Field.Root name="description">
          <Input label="Description" type="textarea" value={form.description} onChange={set("description")} />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 items-start">
        <Field.Root name="tags">
          <TagInput
            label="Tags"
            value={tagsInput}
            onChange={(v) => setTagsInput(v as string[])}
          />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>

        <Field.Root name="keywords">
          <TagInput
            label="Keywords"
            value={keywordsInput}
            onChange={(v) => setKeywordsInput(v as string[])}
          />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>
      </div>

      <h5 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-200 mb-4 mt-6">
        Formats and types
      </h5>

      <div className="grid grid-cols-2 gap-3 mb-3 items-start">
        <Field.Root name="input_file_formats">
          <MultiComboboxInput
            label="Input Formats"
            value={inputFormatsInput}
            onChange={(v) => setInputFormatsInput(v as string[])}
            options={fileExtensions}
            loading={fileExtensionsLoading}
            error={fileExtensionsError?.message}
          />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>

        <Field.Root name="output_file_formats">
          <MultiComboboxInput
            label="Output Formats"
            value={outputFormatsInput}
            onChange={(v) => setOutputFormatsInput(v as string[])}
            options={fileExtensions}
            loading={fileExtensionsLoading}
            error={fileExtensionsError?.message}
          />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>

        <Field.Root name="types">
          <TagInput
            label="Types"
            value={typesInput}
            onChange={(v) => setTypesInput(v as string[])}
          />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>
      </div>

      <div className="flex justify-end mt-8">
        <Button type="submit" disabled={isPending}>
          {createMutation.isPending
            ? "Registering…"
            : updateMutation.isPending
            ? "Updating…"
            : tool
            ? "Update Tool"
            : "Register Tool"}
        </Button>
        {tool && handleDelete && (
          <Button
            type="button"
            className="ml-4 bg-linear-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500"
            onClick={handleDelete}
          >
            Delete Tool
          </Button>
        )}
      </div>
    </Form>
  );
}