import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from "react";
import { useCreateTool } from "../../hooks/useTools";
import type { ToolCreate } from "../../api/types";

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

export const Route = createFileRoute('/tools/new')({
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) throw redirect({ to: "/login" });
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate();
  const createMutation = useCreateTool();
  const [form, setForm] = useState<ToolCreate>(BLANK);
  const [typesInput, setTypesInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [inputFormatsInput, setInputFormatsInput] = useState("");
  const [outputFormatsInput, setOutputFormatsInput] = useState("");
  const [error, setError] = useState<string | null>(null);
 
  const set =
    (key: keyof ToolCreate) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
 
  const csvToArray = (s: string) =>
    s.split(",").map((x) => x.trim()).filter(Boolean);
 
  const handleSubmit = () => {
    setError(null);
    const payload: ToolCreate = {
      ...form,
      types: csvToArray(typesInput),
      tags: csvToArray(tagsInput),
      keywords: csvToArray(keywordsInput),
      input_file_formats: csvToArray(inputFormatsInput),
      output_file_formats: csvToArray(outputFormatsInput),
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
 
    createMutation.mutate(payload, {
      onSuccess: () => navigate({ to: "/" }),
      onError: (e: any) =>
        setError(e?.message ?? "Failed to create tool."),
    });
  };
 
  return (
    <div className="">
      <h1>Register New Tool</h1>
 
      {error && <p className="">{error}</p>}
 
      <div className="">
        <label>
          URI <span className="">*</span>
          <input value={form.uri} onChange={set("uri")} placeholder="https://bio.tools/my-tool" />
        </label>
 
        <label>
          Name <span className="">*</span>
          <input value={form.name} onChange={set("name")} placeholder="My Genomic Tool" />
        </label>
 
        <label>
          Version <span className="">*</span>
          <input value={form.version} onChange={set("version")} placeholder="1.0.0" />
        </label>
 
        <label>
          License
          <input value={form.license ?? ""} onChange={set("license")} placeholder="MIT" />
        </label>
 
        <label className="">
          Description <span className="">*</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={set("description")}
            placeholder="What does this tool do?"
          />
        </label>
 
        <label className="">
          Location (URL)
          <input
            value={form.location ?? ""}
            onChange={set("location")}
            placeholder="https://github.com/org/repo"
          />
        </label>
 
        <label>
          Types <span className="">*</span>{" "}
          <span className="">(comma-separated)</span>
          <input
            value={typesInput}
            onChange={(e) => setTypesInput(e.target.value)}
            placeholder="CommandLineTool, galaxy_workflow"
          />
        </label>
 
        <label>
          Tags <span className="">(comma-separated)</span>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="genomics, alignment"
          />
        </label>
 
        <label>
          Keywords <span className="">(comma-separated)</span>
          <input
            value={keywordsInput}
            onChange={(e) => setKeywordsInput(e.target.value)}
            placeholder="FASTQ, variant-calling"
          />
        </label>
 
        <label>
          Input formats <span className="">(comma-separated)</span>
          <input
            value={inputFormatsInput}
            onChange={(e) => setInputFormatsInput(e.target.value)}
            placeholder="fasta, fastq"
          />
        </label>
 
        <label>
          Output formats <span className="">(comma-separated)</span>
          <input
            value={outputFormatsInput}
            onChange={(e) => setOutputFormatsInput(e.target.value)}
            placeholder="bam, cram"
          />
        </label>
      </div>
 
      <div className="">
        <button
          className=""
          onClick={handleSubmit}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Registering…" : "Register Tool"}
        </button>
        <button className="" onClick={() => navigate({ to: "/" })}>
          Cancel
        </button>
      </div>
    </div>
  );
}
