import { useState, useRef, useEffect, useCallback, type KeyboardEvent } from "react";

type BaseProps = {
  label: string;
};

type InputProps =
  | (BaseProps & {
      type?: "text";
    } & React.InputHTMLAttributes<HTMLInputElement>)
  | (BaseProps & {
      type: "textarea";
    } & React.TextareaHTMLAttributes<HTMLTextAreaElement>);

export function Input(props: InputProps) {
  const { label } = props;
  return (
    <div className="relative w-full group">
      {
        props.type === "textarea" ? 
        <textarea {...props} className="outline-none px-3 py-3 peer w-full" placeholder=""/> : 
        <input type="text" {...props} className="outline-none px-3 py-3 peer w-full" placeholder=""/>
      }
      <label className={`
        absolute 
        left-2.25
        top-px 
        text-sm
        text-gray-400 
        transition-all 
        duration-300 
        px-1 
        transform 
        -translate-y-1/2 
        pointer-events-none 
        ${props.type === "textarea" ? "peer-placeholder-shown:top-6" : "peer-placeholder-shown:top-1/2"}
        peer-placeholder-shown:text-md 
        group-focus-within:top-px! 
        group-focus-within:text-sm!
        group-focus-within:text-indigo-500!
      `}>
        {label}
      </label>

      <fieldset className="
        inset-0 
        absolute 
        border-2
        border-gray-300 
        dark:border-gray-600 
        rounded-xl 
        pointer-events-none 
        -mt-2.25 
        invisible 
        peer-placeholder-shown:visible 
        transition-all 
        duration-300 
        group-focus-within:border-indigo-500!
        group-focus-within:border-2 
        group-hover:border-gray-300
      ">
        <legend className="
          ml-2 
          px-0 
          text-sm 
          transition-all 
          duration-300 
          invisible 
          max-w-[0.01px] 
          group-focus-within:max-w-full 
          group-focus-within:px-1 whitespace-nowrap
        ">
          {label}
        </legend>
      </fieldset>

      <fieldset className="
        inset-0 
        absolute 
        border-2 
        border-gray-300 
        dark:border-gray-600 
        rounded-xl 
        pointer-events-none 
        -mt-2.25 
        visible 
        peer-placeholder-shown:invisible 
        transition-all 
        duration-300 
        group-focus-within:border-2 
        group-focus-within:border-indigo-500! 
        group-hover:border-gray-300
      ">
        <legend className="
          ml-2 
          text-sm 
          invisible 
          px-1 
          max-w-full 
          whitespace-nowrap
        ">
          {label}
        </legend>
      </fieldset>
    </div>
  );
}

export interface AutocompleteInputProps {
  label: string;
  options?: string[];
  multiple?: boolean;
  freeSolo?: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
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
  const [inputValue, setInputValue] = useState("");
  const [selected, setSelected] = useState<string[]>(controlledValue ?? []);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
 
  const hasOptions = options.length > 0;
  const hasValue = selected.length > 0 || inputValue.length > 0;
  const labelFloated = hasValue || focused;
 
  const filtered = hasOptions
    ? options.filter(
        (o) =>
          o.toLowerCase().includes(inputValue.toLowerCase()) &&
          !selected.includes(o)
      )
    : [];
 
  const emit = useCallback(
    (next: string[]) => {
      setSelected(next);
      onChange?.(next);
    },
    [onChange]
  );
 
  const addValue = useCallback(
    (val: string) => {
      const trimmed = val.trim();
      if (!trimmed || selected.includes(trimmed)) return;
      const next = multiple ? [...selected, trimmed] : [trimmed];
      emit(next);
      setInputValue("");
      setOpen(false);
      setHighlighted(-1);
    },
    [selected, multiple, emit]
  );
 
  const removeValue = useCallback(
    (val: string) => {
      emit(selected.filter((s) => s !== val));
      setTimeout(() => inputRef.current?.focus(), 0);
    },
    [selected, emit]
  );
 
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlighted >= 0 && filtered[highlighted]) {
        addValue(filtered[highlighted]);
      } else if (freeSolo && inputValue.trim()) {
        addValue(inputValue);
      }
      return;
    }
    if (e.key === "Backspace" && inputValue === "" && selected.length > 0) {
      removeValue(selected[selected.length - 1]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, -1));
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setHighlighted(-1);
    }
  };
 
  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setHighlighted(-1);
      }
      if (freeSolo && inputValue.trim()) {
        addValue(inputValue);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [inputValue]);
 
  // Scroll highlighted item into view
  useEffect(() => {
    if (highlighted >= 0 && dropdownRef.current) {
      const item = dropdownRef.current.children[highlighted] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted]);
 
  return (
    <div ref={containerRef} className="relative w-full group">
      {/* Input area */}
      <div
        className="outline-none px-3 py-2 peer w-full min-h-12.5 flex flex-wrap gap-1.5 items-center cursor-text"
        onClick={() => {
          inputRef.current?.focus();
          if (hasOptions) setOpen(true);
        }}
      >
        {/* Selected chips — full chip is clickable to remove */}
        {selected.map((val) => (
          <span
            key={val}
            onMouseDown={(e) => {
              e.preventDefault();
              removeValue(val);
            }}
            className="inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm px-2 py-0.5 rounded-lg cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors select-none"
          >
            {val}
            <span className="leading-none opacity-60 hover:opacity-100">×</span>
          </span>
        ))}
 
        {/* Text input */}
        {(multiple || selected.length === 0) && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            placeholder={placeholder ?? ""}
            className="outline-none bg-transparent flex-1 min-w-20 text-base py-1 placeholder-transparent"
            onChange={(e) => {
              setInputValue(e.target.value);
              if (hasOptions) setOpen(true);
              setHighlighted(-1);
            }}
            onFocus={() => {
              setFocused(true);
              if (hasOptions) setOpen(true);
            }}
            onBlur={() => {
              setFocused(false);
              setTimeout(() => setOpen(false), 150);
            }}
            onKeyDown={handleKeyDown}
          />
        )}
      </div>
 
      {/* Floating label — bg cuts through the fieldset border line */}
      <label
        className={`
          absolute
          left-2.25
          px-1
          transform
          -translate-y-1/2
          pointer-events-none
          transition-all
          duration-300
          bg-white
          dark:bg-gray-950
          ${labelFloated ? "top-px text-sm" : "top-1/2 text-md"}
          ${focused
            ? "text-indigo-500"
            : labelFloated
              ? "text-gray-500 dark:text-gray-400"
              : "text-gray-400"
          }
        `}
      >
        {label}
      </label>
 
      {/* Fieldset border — unfloated (no legend gap needed) */}
      <fieldset
        className={`
          inset-0 absolute border-2 rounded-xl pointer-events-none -mt-2.25
          transition-all duration-300
          ${focused ? "border-indigo-500" : "border-gray-300 dark:border-gray-600"}
          ${labelFloated ? "invisible" : "visible"}
        `}
      >
        <legend className="ml-2 px-0 text-sm invisible max-w-[0.01px] whitespace-nowrap">
          {label}
        </legend>
      </fieldset>
 
      {/* Fieldset border — floated (legend creates the gap behind the label) */}
      <fieldset
        className={`
          inset-0 absolute border-2 rounded-xl pointer-events-none -mt-2.25
          transition-all duration-300
          ${focused ? "border-indigo-500" : "border-gray-300 dark:border-gray-600"}
          ${labelFloated ? "visible" : "invisible"}
        `}
      >
        <legend className="ml-2 text-sm invisible px-1 max-w-full whitespace-nowrap">
          {label}
        </legend>
      </fieldset>
 
      {/* Dropdown */}
      {open && (filtered.length > 0 || loading || error) && (
        <ul
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-56 overflow-y-auto py-1"
        >
          {filtered.map((option, i) => (
            <li
              key={option}
              onMouseDown={(e) => {
                e.preventDefault();
                addValue(option);
              }}
              onMouseEnter={() => setHighlighted(i)}
              className={`
                px-3 py-2 text-sm cursor-pointer transition-colors
                ${i === highlighted
                  ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }
              `}
            >
              {option}
            </li>
          ))}
          {loading && (
            <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </li>
          )}
          {error && (
            <li className="px-3 py-2 text-sm text-red-500 dark:text-red-400">
              {error}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}