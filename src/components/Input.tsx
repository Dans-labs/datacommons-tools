import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";
import type React from "react";

// ─── Simple Input ────────────────────────────────────────────────────────────

type BaseProps = { label: string };

type InputProps =
  | (BaseProps & { type?: "text" } & React.InputHTMLAttributes<HTMLInputElement>)
  | (BaseProps & { type: "textarea" } & React.TextareaHTMLAttributes<HTMLTextAreaElement>);

export function Input({ label, ...props }: InputProps) {
  const isTextarea = props.type === "textarea";
  const sharedClass = "outline-none px-3 py-3 peer w-full bg-transparent";

  return (
    <div className="relative w-full group">
      {isTextarea ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={sharedClass}
          placeholder=""
        />
      ) : (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          type="text"
          className={sharedClass}
          placeholder=""
        />
      )}

      <label className={`
        absolute left-2.25 px-1 -translate-y-1/2 pointer-events-none transition-all duration-200
        text-gray-400 bg-gray-100 dark:bg-gray-950
        top-px text-sm
        z-10
        ${isTextarea
          ? "peer-placeholder-shown:top-6"
          : "peer-placeholder-shown:top-1/2"
        }
        peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-400
        group-focus-within:top-px! group-focus-within:text-sm! group-focus-within:text-indigo-500!
      `}>
        {label}
      </label>

      <Fieldset
        label={label}
        legendOpen={false}
        className="invisible peer-placeholder-shown:visible group-focus-within:border-indigo-500! group-focus-within:visible!"
      />
      <Fieldset
        label={label}
        legendOpen
        className="visible peer-placeholder-shown:invisible group-focus-within:border-indigo-500!"
      />
    </div>
  );
}

// ─── Shared Fieldset Border ───────────────────────────────────────────────────

function Fieldset({ label, legendOpen, className }: { label: string; legendOpen: boolean; className?: string }) {
  return (
    <fieldset className={`inset-0 absolute border-2 border-gray-300 dark:border-gray-600 rounded-xl pointer-events-none -mt-2.25 transition-all duration-200 ${className}`}>
      <legend className={`ml-2 text-sm invisible whitespace-nowrap ${legendOpen ? "px-1 max-w-full" : "px-0 max-w-[0.01px]"}`}>
        {label}
      </legend>
    </fieldset>
  );
}

// ─── Autocomplete ─────────────────────────────────────────────────────────────

export interface AutocompleteInputProps {
  label: string;
  options?: string[];
  multiple?: boolean;
  freeSolo?: boolean;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  placeholder?: string;
  loading?: boolean;
  error?: string;
}

export function AutocompleteInput({
  label,
  options = [],
  multiple = false,
  freeSolo = false,
  value: controlledValue,
  onChange,
  placeholder,
  loading,
  error,
}: AutocompleteInputProps) {
  const initialSingle = !multiple && typeof controlledValue === "string" ? controlledValue : "";
  const initialMultiple = multiple && Array.isArray(controlledValue) ? controlledValue : [];

  const [inputValue, setInputValue] = useState(initialSingle);
  const [chips, setChips] = useState<string[]>(initialMultiple);   // only used when multiple
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [focused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const labelFloated = focused || inputValue.length > 0 || chips.length > 0;

  const filtered = options.filter(
    (o) => o.toLowerCase().includes(inputValue.toLowerCase()) && !chips.includes(o)
  );

  // add/remove
  const addValue = useCallback((val: string) => {
    const v = val.trim();
    if (!v || chips.includes(v)) return;
    if (multiple) {
      const next = [...chips, v];
      setChips(next);
      onChange?.(next);
      setInputValue("");
    } else {
      setInputValue(v);
      onChange?.(v);
    }
    setOpen(false);
    setHighlighted(-1);
  }, [chips, multiple, onChange]);

  const removeChip = useCallback((val: string) => {
    const next = chips.filter((c) => c !== val);
    setChips(next);
    onChange?.(next);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [chips, onChange]);

  // keyboard
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === " " || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      if (highlighted >= 0 && filtered[highlighted]) addValue(filtered[highlighted]);
      else if (freeSolo && inputValue.trim()) addValue(inputValue);
      return;
    }
    if (e.key === "Backspace" && inputValue === "") {
      if (multiple && chips.length > 0) removeChip(chips[chips.length - 1]);
      else if (!multiple) { setInputValue(""); onChange?.(""); }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, filtered.length - 1)); return; }
    if (e.key === "ArrowUp")   { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, -1)); return; }
    if (e.key === "Escape")    { setOpen(false); setHighlighted(-1); }
  };

  // outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      if (freeSolo && inputValue.trim()) addValue(inputValue);
      setOpen(false);
      setHighlighted(-1);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [inputValue, freeSolo, multiple, addValue]);

  // scroll highlighted into view
  useEffect(() => {
    if (highlighted >= 0 && dropdownRef.current) {
      (dropdownRef.current.children[highlighted] as HTMLElement)?.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input area */}
      <div
        className="px-3 py-2 w-full min-h-12.5 flex flex-wrap gap-1.5 items-center cursor-text"
        onClick={() => { inputRef.current?.focus(); if (options.length) setOpen(true); }}
      >
        {multiple && chips.map((val) => (
          <span
            key={val}
            onMouseDown={(e) => { e.preventDefault(); removeChip(val); }}
            className="inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm px-2 py-0.5 rounded-lg cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors select-none"
          >
            {val}
            <span className="leading-none opacity-60 hover:opacity-100">×</span>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={placeholder ?? ""}
          className="outline-none bg-transparent flex-1 min-w-20 text-base py-1 placeholder-transparent"
          onChange={(e) => {
            setInputValue(e.target.value);
            if (options.length) setOpen(true);
            setHighlighted(-1);
          }}
          onFocus={() => { setFocused(true); if (options.length) setOpen(true); }}
          onBlur={() => { setFocused(false); setTimeout(() => setOpen(false), 150); }}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Floating label */}
      <label className={`
        absolute left-2.25 px-1 transform -translate-y-1/2 pointer-events-none transition-all duration-200
        bg-gray-100 dark:bg-gray-950 z-1
        ${labelFloated ? "top-px text-sm" : "top-1/2 text-sm"}
        ${focused ? "text-indigo-500" : labelFloated ? "text-gray-500 dark:text-gray-400" : "text-gray-400"}
      `}>
        {label}
      </label>

      <Fieldset label={label} legendOpen={false} className={`${labelFloated ? "invisible" : "visible"} ${focused ? "border-indigo-500" : ""}`} />
      <Fieldset label={label} legendOpen className={`${labelFloated ? "visible" : "invisible"} ${focused ? "border-indigo-500" : ""}`} />

      {/* Dropdown */}
      {open && (filtered.length > 0 || loading || error) && (
        <ul ref={dropdownRef} className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-56 overflow-y-auto py-1">
          {filtered.map((opt, i) => (
            <li
              key={opt}
              onMouseDown={(e) => { e.preventDefault(); addValue(opt); }}
              onMouseEnter={() => setHighlighted(i)}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                i === highlighted
                  ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              {opt}
            </li>
          ))}
          {loading && <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">Loading…</li>}
          {error   && <li className="px-3 py-2 text-sm text-red-500 dark:text-red-400">{error}</li>}
        </ul>
      )}
    </div>
  );
}