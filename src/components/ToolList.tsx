import { Link } from "@tanstack/react-router";
import type { ToolOut, ToolsSearchParams } from "../api/types";
import { useDebouncedCallback } from 'use-debounce';
import Loader from "./Loader";
import { GradientBox, Tags } from "./Box";
import { Input } from "./Input";

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
      <div className="grid grid-cols-3 gap-4">
        
        <div className="col-span-1">
          <GradientBox color="blue">
            <h2>Filter tools</h2>
            <Input
              label="Search by name…"
              onChange={(e) => debounced("name", e.target.value)}
            />
            <Input
              label="Input format (e.g. fasta)"
              onChange={(e) => debounced("input_format", e.target.value)}
            />
            <Input
              label="Output format (e.g. cram)"
              onChange={(e) => debounced("output_format", e.target.value)}
            />
            <Input
              label="Archetype (e.g. galaxy_workflow)"
              onChange={(e) => debounced("archetype", e.target.value)}
            />
          </GradientBox>
        </div>

        <div className="col-span-2 flex justify-center items-center">
          {isLoading && <Loader />}
          {isError && <p>Failed to load tools.</p>}

          <div className="grid grid-cols-4 gap-4">
            {tools?.map((tool) => (
              <div key={tool.id} className="p-4 border rounded">
                <Link to="/tools/$id" params={{ id: String(tool.id) }}>
                  <div className="mb-2">
                    <h3 className="mb-0 overflow-hidden text-ellipsis">{tool.name}</h3>
                    <span className="text-gray-300 text-sm">Version: {tool.version}</span>
                  </div>
                  <p className="text-sm overflow-hidden text-ellipsis">{tool.description?.substring(0, 100)}...</p>
                  {tool.types && 
                    <Tags label="Types" tags={tool.types} color="green" />
                  }
                  {tool.tags && 
                    <Tags label="Tags" tags={tool.tags} color="blue" />
                  } 
                  {tool.input_file_formats &&
                    <Tags label="Input Formats" tags={tool.input_file_formats} color="orange" />
                  }
                  {tool.output_file_formats && 
                    <Tags label="Output Formats" tags={tool.output_file_formats} color="indigo" />
                  }
                </Link>
              </div>
            ))}
          </div>

          {tools?.length === 0 && !isLoading && (
            <p>No tools found. Try adjusting your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}