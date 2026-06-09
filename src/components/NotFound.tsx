import { m } from "@/paraglide/messages";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 md:p-8 w-full">
      <h1 className="overflow-hidden text-ellipsis">{m.not_found_title()}</h1>
      <p className="text-gray-600 dark:text-gray-300">{m.not_found_description()}</p>
    </div>
  );
}
