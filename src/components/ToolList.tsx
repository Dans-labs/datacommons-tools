import { Link } from "@tanstack/react-router";
import type { ToolOut, ToolsSearchParams } from "../api/types";
import { useDebouncedCallback } from 'use-debounce';

export default function ToolList({
  title,
  tools,
  isLoading,
  isError,
  handleFilter,
}: {
  title: string;
  tools?: ToolOut[];
  isLoading: boolean;
  isError: boolean;
  handleFilter: (key: keyof ToolsSearchParams, value: string) => void;
}) {
  const debounced = useDebouncedCallback(
    (key: keyof ToolsSearchParams, value: string) => {
      handleFilter(key, value);
    },
    1000
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1>{title}</h1>
      <h2>Filter tools</h2>
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search by name…"
          onChange={(e) => debounced("name", e.target.value)}
        />
        <input
          placeholder="Input format (e.g. fasta)"
          onChange={(e) => debounced("input_format", e.target.value)}
        />
        <input
          placeholder="Output format (e.g. cram)"
          onChange={(e) => debounced("output_format", e.target.value)}
        />
        <input
          placeholder="Archetype (e.g. galaxy_workflow)"
          onChange={(e) => debounced("archetype", e.target.value)}
        />
      </div>

      {isLoading && <p>Loading tools…</p>}
      {isError && <p>Failed to load tools.</p>}

      <div className="grid grid-cols-4 gap-4">
        {tools?.map((tool) => (
          <div key={tool.id} className="p-4 border rounded">
            <Link to="/tools/$id" params={{ id: String(tool.id) }}>
              <div className="">
                <h3 className="">{tool.name}</h3>
                <span className="">{tool.version}</span>
              </div>
              <p className="">{tool.description}</p>
              <div className="">
                {tool.types?.map((t) => (
                  <span key={t} className="">{t}</span>
                ))}
                {tool.tags?.map((t) => (
                  <span key={t} className="">{t}</span>
                ))}
              </div>
              <div className="">
                {tool.input_file_formats?.length ? (
                  <span>{tool.input_file_formats.join(", ")}</span>
                ) : null}
                {tool.output_file_formats?.length ? (
                  <span>{tool.output_file_formats.join(", ")}</span>
                ) : null}
              </div>
            </Link>
          </div>
        ))}
      </div>

      {tools?.length === 0 && !isLoading && (
        <p>No tools found. Try adjusting your filters.</p>
      )}

    </div>
  );
}