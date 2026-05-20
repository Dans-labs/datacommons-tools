import { useState, useRef } from "react";
import type React from "react";
import { Field } from "@base-ui/react/field";
import { Input as BaseInput } from "@base-ui/react/input";
import { Combobox } from "@base-ui/react/combobox";
import { useVirtualizer } from '@tanstack/react-virtual';

/* Floating label helper */
function Fieldset({
  label,
  floated,
  focused,
}: {
  label: string;
  floated: boolean;
  focused: boolean;
}) {
  return (
    <fieldset
      className={`
        inset-0 absolute border-2 rounded-xl pointer-events-none -mt-2.25
        transition-colors duration-200
        ${focused ? "border-indigo-500" : "border-gray-300 dark:border-gray-600"}
      `}
    >
      <legend
        className="ml-2 text-sm invisible whitespace-nowrap transition-all duration-200"
        style={{ maxWidth: floated ? "100%" : "0.01px" }}
      >
        {label}
      </legend>
    </fieldset>
  );
}

function floatingLabelClass(floated: boolean, focused: boolean) {
  return `
    order-first absolute left-2.25 px-1 -translate-y-1/2 pointer-events-none
    transition-all duration-200 bg-gray-100 dark:bg-gray-950 z-10
    ${floated ? "top-px text-sm" : "top-1/2 text-sm"}
    ${focused
      ? "text-indigo-500"
      : floated
        ? "text-gray-600 dark:text-gray-400"
        : "text-gray-600 dark:text-gray-400"}
  `;
}

type BaseProps = { label: string };

type InputProps =
  | (BaseProps & { type?: "text" } & React.InputHTMLAttributes<HTMLInputElement>)
  | (BaseProps & { type: "textarea" } & React.TextareaHTMLAttributes<HTMLTextAreaElement>);

export function Input({ label, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  const isTextarea = props.type === "textarea";

  const value = (props as any).value ?? "";
  const floated = focused || String(value).length > 0;

  const sharedClass = "outline-none px-3 py-3 w-full bg-transparent";

  return (
    <div
      className="relative w-full group flex flex-col"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={() => setFocused(false)}
    >
      {isTextarea ? (
        <Field.Control
          render={<textarea />}
          {...(props as any)}
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

      <Field.Label className={floatingLabelClass(floated, focused)}>
        {label}
      </Field.Label>

      <Fieldset label={label} floated={floated} focused={focused} />
    </div>
  );
}

const popupClass =
  "w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 outline-none";
const itemClass =
  "px-3 py-2 text-sm cursor-pointer transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 data-[highlighted]:bg-indigo-50 dark:data-[highlighted]:bg-indigo-900/40 data-[selected]:bg-indigo-50 dark:data-[selected]:bg-indigo-900/40 data-[highlighted]:text-indigo-700 dark:data-[highlighted]:text-indigo-300";
export const chipClass =
  "inline-flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-sm px-2 py-0.5 rounded-lg select-none m-0.5";

/* ComboboxInput — single value, predefined options */
interface ComboboxInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options?: string[];
  loading?: boolean;
  error?: string;
}

export function ComboboxInput({
  label,
  value,
  onChange,
  options = [],
  loading,
  error,
}: ComboboxInputProps) {
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
        <Combobox.Input
          placeholder=""
          className="outline-none px-3 py-3 w-full bg-transparent"
        />

        <Field.Label className={floatingLabelClass(floated, open)}>
          {label}
        </Field.Label>

        <Fieldset label={label} floated={floated} focused={open} />

        <Combobox.Portal>
          <Combobox.Positioner align="start">
            <Combobox.Popup className={popupClass} style={{ width: "var(--anchor-width)" }}>
              {(loading || error) && (
                <Combobox.Empty className="px-3 py-2 text-sm text-gray-500">
                  {loading ? "Loading…" : <span className="text-red-500">{error}</span>}
                </Combobox.Empty>
              )}
              <Combobox.List>
                <VirtualizedList />
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
}

/* MultiComboboxInput — multiple values, predefined options, chips */
interface MultiComboboxInputProps {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  options?: string[];
  loading?: boolean;
  error?: string;
}

export function MultiComboboxInput({
  label,
  value,
  onChange,
  options = [],
  loading,
  error,
}: MultiComboboxInputProps) {
  const [open, setOpen] = useState(false);
  const floated = open || value.length > 0;

  return (
    <div className="relative w-full">
      <Combobox.Root
        items={options}
        value={value}
        multiple
        virtualized
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
            className="outline-none bg-transparent flex-1 min-w-20 text-base py-1"
          />
        </Combobox.InputGroup>

        <Field.Label className={floatingLabelClass(floated, open)}>
          {label}
        </Field.Label>

        <Fieldset label={label} floated={floated} focused={open} />

        <Combobox.Portal>
          <Combobox.Positioner align="start">
            <Combobox.Popup className={popupClass} style={{ width: "var(--anchor-width)" }}>
              {(loading || error) && (
                <Combobox.Empty className="px-3 py-2 text-sm text-gray-500">
                  {loading ? "Loading…" : <span className="text-red-500">{error}</span>}
                </Combobox.Empty>
              )}
              <Combobox.List>
                <VirtualizedList />
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
}

/* 
TagInput — free-form tags, no predefined options
Uses a hidden Field.Control so Base UI tracks validity natively (required).
tabIndex={-1} + aria-hidden keep it out of the tab order and away from AT. 
*/

interface TagInputProps {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  required?: boolean;
}

export function TagInput({ label, value: chips, onChange, required }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
 
  const floated = focused || chips.length > 0 || inputValue.length > 0;
 
  // Dispatch a native input event on the hidden Field.Control whenever chips
  // change so Base UI re-evaluates validity immediately, not just on submit.
  const dispatchNativeInput = (nextChips: string[]) => {
    const el = hiddenRef.current;
    if (!el) return;
    // Set the raw value directly so the native required check sees it.
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!
      .set!.call(el, nextChips.join(","));
    el.dispatchEvent(new Event("input", { bubbles: true }));
  };
 
  const add = (val: string) => {
    const v = val.trim();
    if (!v || chips.includes(v)) return;
    const next = [...chips, v];
    onChange(next);
    dispatchNativeInput(next);
    setInputValue("");
  };
 
  const remove = (val: string) => {
    const next = chips.filter((c) => c !== val);
    onChange(next);
    dispatchNativeInput(next);
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
      {/* Hidden control — gives Base UI a real validity target for `required`.
          aria-hidden + tabIndex={-1} keep it invisible to AT and keyboard nav.
          We hold a ref so we can fire native input events to trigger live
          validity re-evaluation as chips are added/removed. */}
      <Field.Control
        render={<input />}
        ref={hiddenRef}
        aria-hidden
        tabIndex={-1}
        required={required}
        value={chips.join(",")}
        onChange={() => {}}
        className="sr-only"
      />
 
      <div
        className="px-3 py-2 w-full min-h-12.5 flex flex-wrap items-center cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {chips.map((val) => (
          <span
            key={val}
            onMouseDown={(e) => { e.preventDefault(); remove(val); }}
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
          onBlur={() => { setFocused(false); if (inputValue.trim()) add(inputValue); }}
          onKeyDown={handleKeyDown}
          aria-label={label}
        />
      </div>
 
      <Field.Label className={floatingLabelClass(floated, focused)}>
        {label}
      </Field.Label>
 
      <Fieldset label={label} floated={floated} focused={focused} />
    </div>
  );
}

const ITEM_HEIGHT = 36; // px — must match the item's rendered height
const MAX_VISIBLE = 8;  // rows shown before scrolling kicks in

function VirtualizedList() {
  const filteredItems = Combobox.useFilteredItems<string>();

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 3,
  });

  return (
    <div
      ref={scrollRef}
      className="overflow-y-auto w-full"
      style={{
        maxHeight: ITEM_HEIGHT * MAX_VISIBLE,
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((vItem) => {
          const item = filteredItems[vItem.index];

          return (
            <Combobox.Item
              key={vItem.key}
              index={vItem.index}
              value={item}
              ref={virtualizer.measureElement}
              className={itemClass}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${vItem.start}px)`,
              }}
            >
              {item}
            </Combobox.Item>
          );
        })}
      </div>
    </div>
  );
}