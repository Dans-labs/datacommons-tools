import { Link } from "@tanstack/react-router";
import type { ToolOut, ToolsSearchParams } from "../api/types";
import { useDebouncedCallback } from 'use-debounce';
import Loader from "./Loader";
import { GradientBox, Tags } from "./Box";
import { Input } from "./Input";
import { List, useDynamicRowHeight, type RowComponentProps } from "react-window";
import { Button } from "./Button";

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

  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 50
  });

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1>{title}</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 sticky top-4 self-start">
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

          <List
            rowComponent={Tool}
            rowCount={tools?.length || 0}
            rowHeight={rowHeight}
            rowProps={{ tools: tools || [] }}
          />

          {tools?.length === 0 && !isLoading && (
            <p>No tools found. Try adjusting your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Tool({ index, tools }: RowComponentProps<{ tools: ToolOut[] }>) {
  const tool = tools[index];
  console.log(tool)
  return (
    <div className="p-4 border rounded-xl mb-3 bg-black">
      <div className="mb-2">
        <h3 className="mb-0 overflow-hidden text-ellipsis">{tool.name}</h3>
        <span className="text-gray-300 text-sm">Version: {tool.version}</span>
      </div>
      <p className="text-sm overflow-hidden text-ellipsis">{tool.description?.substring(0, 100)}...</p>
      <div className="mb-4">
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
      </div>
      <div className="text-right">
        <Link to="/tools/$id" params={{ id: String(tool.id) }} className="ml-2">
          <Button className="">View details</Button>
        </Link> 
        <Link to="/tools/$id/edit" params={{ id: String(tool.id) }} className="ml-2">
          <Button className="">Edit tool</Button>
        </Link> 
      </div>
    </div>
  )
}
