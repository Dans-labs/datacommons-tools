import { Link } from "@tanstack/react-router";
import type { ToolOut, ToolsSearchParams } from "../api/types";
import { useDebouncedCallback } from 'use-debounce';
import Loader from "./Loader";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { TagList } from "./Tags";

interface ToolGridProps {
  title?: string;
  tools?: ToolOut[];
  isLoading?: boolean;
  isError?: boolean;
  handleFilter: (key: keyof ToolsSearchParams, value: string) => void;
}

const COLS = [
  { key: "name",          label: "Name",           filterKey: "name" as const,          placeholder: "Search name…",         grow: "flex-[2_0_180px]" },
  { key: "input_format",  label: "Input formats",  filterKey: "input_format" as const,  placeholder: "e.g. fasta",           grow: "flex-[1.5_0_140px]" },
  { key: "output_format", label: "Output formats", filterKey: "output_format" as const, placeholder: "e.g. cram",            grow: "flex-[1.5_0_140px]" },
  { key: "archetype",     label: "Archetype",      filterKey: "archetype" as const,     placeholder: "e.g. galaxy_workflow", grow: "flex-[2_0_160px]" },
] as const;

export default function ToolList({
  title = "Tools",
  tools,
  isLoading,
  isError,
  handleFilter,
}: ToolGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
 
  const debounced = useDebouncedCallback(
    (key: keyof ToolsSearchParams, value: string) => handleFilter(key, value),
    300
  );
 
  const rowVirtualizer = useVirtualizer({
    count: tools?.length ?? 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 56,
    overscan: 8,
  });
 
  return (
    <div className="">
      {/* header */}
      <div className="flex items-baseline gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <h1>{title}</h1>
        <span className="text-sm text-gray-400">
          {isLoading ? "loading…" : `${tools?.length ?? 0} results`}
        </span>
      </div>
 
      <div className="flex px-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        {COLS.map((col) => (
          <div key={col.key} className={`${col.grow} py-2.5 pr-4`}>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-600 dark:text-gray-200 mb-1.5">
              {col.label}
            </p>
            <input
              type="text"
              placeholder={col.placeholder}
              onChange={(e) => debounced(col.filterKey, e.target.value)}
              className="w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 rounded-none px-0 py-1 text-xs font-mono text-gray-700 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
            />
          </div>
        ))}
      </div>
 
      {/* virtualized body */}
      <div ref={scrollRef} className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {isLoading && (
          <div className="flex items-center justify-center h-full text-sm text-gray-400 p-10">
            <Loader />
          </div>
        )}
        {isError && (
          <div className="flex items-center justify-center h-full text-sm text-red-400">
            Failed to load tools.
          </div>
        )}
        {!isLoading && !isError && (tools?.length ?? 0) === 0 && (
          <div className="flex items-center justify-center h-full text-sm text-gray-300 dark:text-gray-600">
            No tools found. Try adjusting your filters.
          </div>
        )}
        {!isLoading && !isError && (tools?.length ?? 0) > 0 && (
          <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
            {rowVirtualizer.getVirtualItems().map((vItem) => (
              <div
                key={vItem.key}
                ref={rowVirtualizer.measureElement}
                data-index={vItem.index}
                style={{ position: "absolute", top: 0, transform: `translateY(${vItem.start}px)`, width: "100%" }}
              >
                <ToolRow tool={tools![vItem.index]} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolRow({ tool }: { tool: ToolOut }) {
  return (
    <Link 
      to="/tools/$id" 
      params={{ id: String(tool.id) }}
      className="flex items-start border-b border-gray-100 dark:border-gray-800 px-6 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
    >
      <div className="flex-[2_0_180px] pr-4 min-w-0">
        <p className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">{tool.name}</p>
        <p className="text-xs text-gray-400 font-mono mt-0.5">{tool.version}</p>
      </div>
      <div className="flex-[1.5_0_140px] pr-4 min-w-0">
        <TagList tags={tool.input_file_formats} col="input_format" />
      </div>
      <div className="flex-[1.5_0_140px] pr-4 min-w-0">
        <TagList tags={tool.output_file_formats} col="output_format" />
      </div>
      <div className="flex-[2_0_160px] pr-4 min-w-0">
        <TagList tags={tool.tags} col="archetype" />
      </div>
    </Link>
  );
}