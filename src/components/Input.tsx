import { useState, useRef } from "react";
import type React from "react";
import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import { Combobox } from "@base-ui/react/combobox";

// ─── Simple Input ────────────────────────────────────────────────────────────

type BaseProps = { label: string };

type InputProps =
  | (BaseProps & { type?: "text" } & React.InputHTMLAttributes<HTMLInputElement>)
  | (BaseProps & { type: "textarea" } & React.TextareaHTMLAttributes<HTMLTextAreaElement>);

export function Input({ label, ...props }: InputProps) {
  const isTextarea = props.type === "textarea";
  const sharedClass = "outline-none px-3 py-3 peer w-full bg-transparent";

  return (
    <div className="relative w-full group flex flex-col">
      {isTextarea ? (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={sharedClass}
          placeholder=""
        />
      ) : (
        <Field.Control
          render={<BaseInput />}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          type="text"
          className={sharedClass}
          placeholder=""
        />
      )}

      <Field.Label
        className={`
          order-first
          absolute left-2.25 px-1 -translate-y-1/2 pointer-events-none transition-all duration-200
          text-gray-400 bg-gray-100 dark:bg-gray-950
          top-px text-sm z-10
          ${isTextarea ? "peer-placeholder-shown:top-6" : "peer-placeholder-shown:top-1/2"}
          peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-400
          group-focus-within:top-px! group-focus-within:text-sm! group-focus-within:text-indigo-500!
        `}
      >
        {label}
      </Field.Label>

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

function Fieldset({
  label,
  legendOpen,
  className,
}: {
  label: string;
  legendOpen: boolean;
  className?: string;
}) {
  return (
    <fieldset
      className={`inset-0 absolute border-2 border-gray-300 dark:border-gray-600 rounded-xl pointer-events-none -mt-2.25 transition-all duration-200 ${className}`}
    >
      <legend
        className={`ml-2 text-sm invisible whitespace-nowrap ${
          legendOpen ? "px-1 max-w-full" : "px-0 max-w-[0.01px]"
        }`}
      >
        {label}
      </legend>
    </fieldset>
  );
}


// Shared popup classes
const popupClass = "w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-56 overflow-y-auto py-1 outline-none";
const itemClass = "px-3 py-2 text-sm cursor-pointer transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 data-[highlighted]:bg-indigo-50 dark:data-[highlighted]:bg-indigo-900/40 data-[selected]:bg-indigo-50 dark:data-[selected]:bg-indigo-900/40 data-[highlighted]:text-indigo-700 dark:data-[highlighted]:text-indigo-300";
const chipClass = "inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm px-2 py-0.5 rounded-lg select-none m-0.5";

// ─── 1. ComboboxInput — single, predefined options ────────────────────────────

interface ComboboxInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options?: string[];
  loading?: boolean;
  error?: string;
}

export function ComboboxInput({ label, value, onChange, options = [], loading, error }: ComboboxInputProps) {
  const [open, setOpen] = useState(false);
  const floated = open || value.length > 0;

  return (
    <div className="relative w-full">
      <Combobox.Root
        items={options}
        value={value}
        onValueChange={(v) => onChange(v as string)}
        onOpenChange={setOpen}
      >
        {/* Input — before label in DOM so peer works, label uses order-first */}
        <Combobox.Input
          placeholder=""
          className="outline-none px-3 py-3 w-full bg-transparent peer"
        />

        <Field.Label className={`
          order-first absolute left-2.25 px-1 -translate-y-1/2 pointer-events-none
          transition-all duration-200 bg-gray-100 dark:bg-gray-950 z-10
          ${floated ? "top-px text-sm" : "top-1/2 text-sm"}
          ${open ? "text-indigo-500" : floated ? "text-gray-500 dark:text-gray-400" : "text-gray-400"}
        `}>
          {label}
        </Field.Label>

        <Fieldset label={label} legendOpen={false} className={`${floated ? "invisible" : "visible"} ${open ? "border-indigo-500" : ""}`} />
        <Fieldset label={label} legendOpen   className={`${floated ? "visible" : "invisible"} ${open ? "border-indigo-500" : ""}`} />

        <Combobox.Portal>
          <Combobox.Positioner align="start">
            <Combobox.Popup className={popupClass}>
              {(loading || error) && (
                <Combobox.Empty className="px-3 py-2 text-sm text-gray-500">
                  {loading ? "Loading…" : error ? <span className="text-red-500">{error}</span> : "No options"}
                </Combobox.Empty>
              )}
              <Combobox.List>
                {(opt: string) => (
                  <Combobox.Item key={opt} value={opt} className={itemClass}>
                    {opt}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
}

// ─── 2. MultiComboboxInput — multiple, predefined options, chips ──────────────

interface MultiComboboxInputProps {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  options?: string[];
  loading?: boolean;
  error?: string;
}

export function MultiComboboxInput({ label, value, onChange, options = [], loading, error }: MultiComboboxInputProps) {
  const [open, setOpen] = useState(false);
  const floated = open || value.length > 0;

  return (
    <div className="relative w-full">
      <Combobox.Root
        items={options}
        value={value}
        multiple
        onValueChange={(v) => onChange(v as string[])}
        onOpenChange={setOpen}
      >
        <Combobox.InputGroup className="px-3 py-2 w-full min-h-12.5 flex flex-wrap gap-1.5 items-center cursor-text">
          <Combobox.Chips>
            {value.map((val) => (
              <Combobox.Chip key={val} className={chipClass}>
                {val}
                <Combobox.ChipRemove
                  aria-label={`Remove ${val}`}
                  className="opacity-60 hover:opacity-100 leading-none cursor-pointer"
                >
                  ×
                </Combobox.ChipRemove>
              </Combobox.Chip>
            ))}
          </Combobox.Chips>
          <Combobox.Input
            placeholder=""
            className="outline-none bg-transparent flex-1 min-w-20 text-base py-1 peer"
          />
        </Combobox.InputGroup>

        <Field.Label className={`
          order-first absolute left-2.25 px-1 -translate-y-1/2 pointer-events-none
          transition-all duration-200 bg-gray-100 dark:bg-gray-950 z-10
          ${floated ? "top-px text-sm" : "top-1/2 text-sm"}
          ${open ? "text-indigo-500" : floated ? "text-gray-500 dark:text-gray-400" : "text-gray-400"}
        `}>
          {label}
        </Field.Label>

        <Fieldset label={label} legendOpen={false} className={`${floated ? "invisible" : "visible"} ${open ? "border-indigo-500" : ""}`} />
        <Fieldset label={label} legendOpen   className={`${floated ? "visible" : "invisible"} ${open ? "border-indigo-500" : ""}`} />

        <Combobox.Portal>
          <Combobox.Positioner align="start">
            <Combobox.Popup className={popupClass}>
              {(loading || error) && (
                <Combobox.Empty className="px-3 py-2 text-sm text-gray-500">
                  {loading ? "Loading…" : error ? <span className="text-red-500">{error}</span> : "No options"}
                </Combobox.Empty>
              )}
              <Combobox.List>
                {(opt: string) => (
                  <Combobox.Item key={opt} value={opt} className={itemClass}>
                    {opt}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
}

// ─── 3. TagInput — multiple free-solo, no options (plain, no Combobox) ────────
// Combobox explicitly doesn't support free-form text, so this stays manual.
// It still wires into Field.Root via Field.Control for form/validation context.

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}

export function TagInput({ label, value: chips, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const floated = focused || chips.length > 0 || inputValue.length > 0;

  const add = (val: string) => {
    const v = val.trim();
    if (!v || chips.includes(v)) return;
    onChange([...chips, v]);
    setInputValue("");
  };

  const remove = (val: string) => {
    onChange(chips.filter((c) => c !== val));
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", " ", ",", "Tab"].includes(e.key)) {
      e.preventDefault();
      add(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && chips.length > 0) {
      remove(chips[chips.length - 1]);
    }
  };

  return (
    <div className="relative w-full">
      {/* IMPORTANT: real native control for Base UI validation */}
      <Field.Control
        render={
          <input
            type="text"
            value={chips.join(",")}
            readOnly
            required
            className="sr-only"
          />
        }
      />

      {/* Visual UI (not used for validation) */}
      <div
        className="px-3 py-2 w-full min-h-12.5 flex flex-wrap items-center cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {chips.map((val) => (
          <span
            key={val}
            onMouseDown={(e) => {
              e.preventDefault();
              remove(val);
            }}
            className={`${chipClass} cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-800`}
          >
            {val}
            <span className="opacity-60 hover:opacity-100 leading-none">×</span>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          className="outline-none bg-transparent flex-1 min-w-20 text-base py-1"
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            if (inputValue.trim()) add(inputValue);
          }}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Label */}
      <Field.Label
        className={`
          order-first absolute left-2.25 px-1 -translate-y-1/2 pointer-events-none
          transition-all duration-200 bg-gray-100 dark:bg-gray-950 z-10
          ${floated ? "top-px text-sm" : "top-1/2 text-sm"}
          ${
            focused
              ? "text-indigo-500"
              : floated
                ? "text-gray-500 dark:text-gray-400"
                : "text-gray-400"
          }
        `}
      >
        {label}
      </Field.Label>

      {/* Border UI */}
      <Fieldset
        label={label}
        legendOpen={false}
        className={`${floated ? "invisible" : "visible"} ${focused ? "border-indigo-500" : ""}`}
      />
      <Fieldset
        label={label}
        legendOpen
        className={`${floated ? "visible" : "invisible"} ${focused ? "border-indigo-500" : ""}`}
      />
    </div>
  );
}