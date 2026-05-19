import { Input, ComboboxInput, MultiComboboxInput, TagInput } from "./Input";
import { Button } from "./Button";
import { useState } from "react";
import { useFileExtensions, useLicenses } from "../hooks/useLists";
import { useCreateTool, useUpdateTool } from "../hooks/useTools";
import type { ToolCreate, ToolOutExt } from "../api/types";
import { useNavigate } from "@tanstack/react-router";
import { toastManager } from "./Toast";
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
  // Only used for server-side mutation errors — field validation is native/Base UI.
  const [serverError, setServerError] = useState<string | null>(null);

  const set =
    (key: keyof ToolCreate) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const setArr =
    (key: keyof ToolCreate) => (v: string[]) =>
      setForm((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Native validation (required attributes) is handled by Base UI + browser.
    // Only extra check: types array, which has no native required equivalent.
    if (!form.types?.length) {
      toastManager.add({
        title: "Please add at least one type.",
        data: { variant: "error" },
      });
      return;
    }

    const onError = (e: any, action: string) => {
      const msg = e?.message ?? `Failed to ${action} tool.`;
      toastManager.add({ 
        title: "Error", 
        description: msg, 
        data: { variant: "error" } 
      });
      setServerError(msg);
    };

    if (tool) {
      updateMutation.mutate(form, {
        onSuccess: () => {
          toastManager.add({ 
            title: "Success",
            description: "Tool updated successfully!", 
            data: { variant: "success" } 
          });
          navigate({ to: `/tools/${tool.id}` });
        },
        onError: (e) => onError(e, "update"),
      });
    } else {
      createMutation.mutate(form, {
        onSuccess: () => {
          toastManager.add({ 
            title: "Success",
            description: "Tool created successfully!", 
            data: { variant: "success" } 
          });
          navigate({ to: `/tools/my-tools` });
        },
        onError: (e) => onError(e, "create"),
      });
    }
  };

  const { data: fileExtensions, isLoading: fileExtensionsLoading, error: fileExtensionsError } = useFileExtensions();
  const { data: licenses, isLoading: licensesLoading, error: licensesError } = useLicenses();

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form onSubmit={handleSubmit}>
      {serverError && (
        <div className="bg-red-700 rounded-lg px-4 py-3 mb-6 text-white">
          Error! {serverError}
        </div>
      )}

      <SectionHeading>Identity</SectionHeading>

      <div className="mb-3">
        <Field.Root name="name">
          <Input label="Name" value={form.name} onChange={set("name")} required />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 items-start">
        <Field.Root name="uri">
          <Input label="URI" value={form.uri} onChange={set("uri")} required />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>

        <Field.Root name="location">
          <Input label="Location (URL)" value={form.location ?? ""} onChange={set("location")} />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>

        <Field.Root name="version">
          <Input label="Version" value={form.version} onChange={set("version")} required />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>

        <Field.Root name="license">
          <ComboboxInput
            label="License"
            value={form.license ?? ""}
            onChange={(v) => setForm((p) => ({ ...p, license: v }))}
            options={licenses}
            loading={licensesLoading}
            error={licensesError?.message}
          />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>
      </div>

      <SectionHeading>Details</SectionHeading>

      <div className="mb-3">
        <Field.Root name="description">
          <Input label="Description" type="textarea" value={form.description} onChange={set("description")} required />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 items-start">
        <Field.Root name="tags">
          <TagInput label="Tags" value={form.tags ?? []} onChange={setArr("tags")} />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>

        <Field.Root name="keywords">
          <TagInput label="Keywords" value={form.keywords ?? []} onChange={setArr("keywords")} />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>
      </div>

      <SectionHeading>Formats and types</SectionHeading>

      <div className="grid grid-cols-2 gap-3 mb-3 items-start">
        <Field.Root name="input_file_formats">
          <MultiComboboxInput
            label="Input Formats"
            value={form.input_file_formats ?? []}
            onChange={setArr("input_file_formats")}
            options={fileExtensions}
            loading={fileExtensionsLoading}
            error={fileExtensionsError?.message}
          />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>

        <Field.Root name="output_file_formats">
          <MultiComboboxInput
            label="Output Formats"
            value={form.output_file_formats ?? []}
            onChange={setArr("output_file_formats")}
            options={fileExtensions}
            loading={fileExtensionsLoading}
            error={fileExtensionsError?.message}
          />
          <Field.Error className="text-sm text-red-500 mt-1" />
        </Field.Root>

        <Field.Root name="types">
          {/* required here so Base UI marks the field invalid when empty */}
          <TagInput label="Types" value={form.types ?? []} onChange={setArr("types")} required />
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
            disabled={isPending}
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="text-sm font-medium uppercase tracking-widest text-gray-600 dark:text-gray-200 mb-4 mt-6">
      {children}
    </h5>
  );
}