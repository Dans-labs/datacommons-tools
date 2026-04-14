const TAG_CLASS: Record<string, string> = {
  input_format:  "bg-amber-100  text-amber-800  dark:bg-amber-900/40  dark:text-amber-300",
  output_format: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  archetype:     "bg-green-100  text-green-800  dark:bg-green-900/40  dark:text-green-300",
  keyword:       "bg-rose-100   text-rose-800   dark:bg-rose-900/40   dark:text-rose-300",
  tags:          "bg-sky-100    text-sky-800    dark:bg-sky-900/40    dark:text-sky-300",
};
 
export function Tag({ label, col }: { label: string; col: keyof typeof TAG_CLASS }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono mr-1 mb-1 ${TAG_CLASS[col]}`}>
      {label}
    </span>
  );
}
 
export function TagList({ tags, col, className }: { tags: string[] | null; col: keyof typeof TAG_CLASS; className?: string }) {
  if (!tags?.length) return <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>;
  return (
    <div className={`flex flex-wrap ${className}`}>
      {tags.map((t) => <Tag key={t} label={t} col={col} />)}
    </div>
  );
}