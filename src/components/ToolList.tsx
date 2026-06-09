import { Link } from "@tanstack/react-router";
import type { ToolOut, ToolsSearchParams } from "@/api/types";
import { useDebouncedCallback } from "use-debounce";
import Loader from "./Loader";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TagList } from "./Tags";
import { useRef, useEffect } from "react";
import { Input } from "@base-ui/react/input";
import { m } from "@/paraglide/messages";

interface ToolGridProps {
  title?: string;
  tools?: ToolOut[];
  total?: number;
  isLoading?: boolean;
  isError?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  fetchNextPage?: () => void;
  handleFilter: (key: keyof ToolsSearchParams, value: string) => void;
  searchParams?: ToolsSearchParams;
}

const COLS = [
  {
    key: "name",
    label: m.name(),
    filterKey: "name" as const,
    placeholder: m.search_name(),
    grow: "flex-[2_0_180px]",
  },
  {
    key: "description",
    label: m.description(),
    filterKey: "description" as const,
    placeholder: m.search_description(),
    grow: "flex-[2_0_180px]",
  },
  {
    key: "input_file_formats",
    label: m.input_formats(),
    filterKey: "input_format" as const,
    placeholder: m.search_input_formats(),
    grow: "flex-[1.5_0_140px]",
  },
  {
    key: "tags",
    label: m.tags(),
    filterKey: "tag" as const,
    placeholder: m.search_tags(),
    grow: "flex-[1.5_0_140px]",
  },
] as const;

export default function ToolList({
  title = "Tools",
  tools,
  total,
  isLoading,
  isError,
  handleFilter,
  searchParams,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
}: ToolGridProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const debounced = useDebouncedCallback(
    (key: keyof ToolsSearchParams, value: string) => handleFilter(key, value),
    1000,
  );

  const rowVirtualizer = useVirtualizer({
    count: total ?? 0,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 100,
    overscan: 8,
    getItemKey: (index) => tools?.[index]?.id ?? index,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();
  useEffect(() => {
    const last = virtualItems[virtualItems.length - 1];
    if (!last) return;
    if (last.index >= (tools?.length ?? 0) - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.();
    }
  }, [virtualItems, hasNextPage, isFetchingNextPage, tools?.length]);

  useEffect(() => {
    // scroll back to clicked on tool if back button is used from details page
    const targetId = sessionStorage.getItem("scrollToToolId");
    if (!targetId || !tools?.length) return;

    const index = tools.findIndex((t) => String(t.id) === targetId);
    if (index === -1) return;

    sessionStorage.removeItem("scrollToToolId");
    setTimeout(() => {
      rowVirtualizer.scrollToIndex(index, { align: "center", behavior: "auto" });
    }, 50);
  }, [tools]);

  return (
    <div className="h-screen overflow-hidden">
      <div
        className="flex items-baseline gap-2.5 px-6 py-4 border-b border-gray-200 dark:border-gray-800"
        ref={headerRef}
      >
        <h1>{title}</h1>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {isLoading ? m.fetching() : m.results({ count: total ?? 0 })}
        </span>
      </div>

      {/* horizontal scroll wrapper — filter bar + body move together */}
      <div className="overflow-x-auto">
        <div className="min-w-160 relative">
          {/* vertical scroll body */}
          <div
            ref={scrollRef}
            className="overflow-y-auto bg-gray-50 dark:bg-gray-900"
            style={{ height: `calc(100vh - ${headerRef.current?.offsetHeight ?? 89}px)` }}
          >
            <div className="flex px-6 bg-gray-50/70 dark:bg-gray-900/70 backdrop-blur border-b border-gray-200 dark:border-gray-800 sticky top-0 z-20">
              {COLS.map((col, index) => (
                <div
                  key={`col-${index}-${col.key}`}
                  className={`${col.grow} py-2.5 pr-4 max-w-150`}
                >
                  <p className="text-xs font-medium uppercase tracking-widest text-gray-600 dark:text-gray-200 mb-1.5">
                    {col.label}
                  </p>
                  {col.filterKey && (
                    <Input
                      key={col.filterKey + (searchParams?.[col.filterKey] ?? "")}
                      type="text"
                      defaultValue={searchParams?.[col.filterKey] ?? ""}
                      placeholder={col.placeholder}
                      onChange={(e) => debounced(col.filterKey, e.target.value)}
                      className="w-full bg-transparent border-0 border-b border-gray-200 dark:border-gray-700 rounded-none px-0 py-1 text-xs font-mono text-gray-700 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors"
                    />
                  )}
                </div>
              ))}
            </div>

            {isLoading && (
              <div className="flex items-center justify-center h-50 text-sm text-gray-400 p-10">
                <Loader />
              </div>
            )}
            {isError && (
              <div className="flex items-center justify-center h-50 text-sm text-red-400">
                {m.error_loading_tools()}
              </div>
            )}
            {!isLoading && !isError && (tools?.length ?? 0) === 0 && (
              <div className="flex items-center justify-center h-50 text-sm text-gray-400 dark:text-gray-400">
                {m.no_tools_found()}
              </div>
            )}
            {!isLoading && !isError && (tools?.length ?? 0) > 0 && (
              <div
                className="relative overflow-hidden"
                style={{ height: rowVirtualizer.getTotalSize() }}
              >
                {virtualItems.map((vItem, i) => {
                  const tool = tools?.[vItem.index];
                  if (!tool)
                    return (
                      <div
                        key={vItem.key}
                        style={{
                          position: "absolute",
                          top: 0,
                          transform: `translateY(${vItem.start}px)`,
                          width: "100%",
                          height: 100,
                        }}
                      />
                    );
                  return (
                    <div
                      key={`${vItem.key}-${i}`}
                      data-index={vItem.index}
                      style={{ transform: `translateY(${vItem.start}px)` }}
                      className="hover:z-10 w-full absolute top-0"
                    >
                      <ToolRow tool={tool} odd={vItem.index % 2 === 0} />
                    </div>
                  );
                })}
              </div>
            )}
            {isFetchingNextPage && (
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center h-20 text-sm text-gray-700 dark:text-gray-300 p-10 bg-linear-to-t from-gray-50 dark:from-gray-900 pointer-events-none overflow-hidden">
                <Loader />
                <span className="ml-2">{m.fetching_more_tools()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolRow({ tool, odd }: { tool: ToolOut; odd: boolean }) {
  return (
    <Link
      to="/tools/$id"
      params={{ id: String(tool.id) }}
      className={`
        overflow-hidden min-h-25 h-25 px-6 py-2.5 w-full
        hover:h-auto hover:-translate-y-1 transform-gpu
        flex items-start 
        border-b border-gray-200 dark:border-gray-800 
        hover:bg-white/80 dark:hover:bg-gray-950/80 transition-transform duration-100 backdrop-blur
        ${
          !odd
            ? "bg-gray-100 dark:bg-gray-900 before:from-gray-100 before:to-transparent dark:before:from-gray-900"
            : "bg-gray-200 dark:bg-gray-800 before:from-gray-200 before:to-transparent dark:before:from-gray-800"
        }
        before:absolute before:content-[""] before:bottom-0 before:left-0 before:right-0 before:h-5 before:bg-linear-to-t hover:before:opacity-0
      `}
      onClick={() => sessionStorage.setItem("scrollToToolId", String(tool.id))}
    >
      {COLS.map((col) => {
        if (col.key === "name") {
          return (
            <div key={col.key} className={`${col.grow} pr-4 min-w-0 max-w-150`}>
              <p className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-1">
                {tool.name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-mono mt-0.5">
                {tool.version}
              </p>
            </div>
          );
        }
        if (col.key === "description") {
          return (
            <div key={col.key} className={`${col.grow} pr-4 min-w-0 max-w-150`}>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                {tool.description}
              </p>
            </div>
          );
        }
        return (
          <div className={`${col.grow} pr-4 min-w-0 max-w-150`} key={col.key}>
            <TagList tags={tool[col.key]} col={col.key} />
          </div>
        );
      })}
    </Link>
  );
}
