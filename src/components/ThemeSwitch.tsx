// ThemeSwitcher.jsx
import { useEffect, useState } from "react";
import { ComputerDesktopIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { Toggle } from "@base-ui/react/toggle";
import Tooltip from "./Tooltip";
import { Button } from "@base-ui/react"

const themes = [
  { key: "system", label: "System", Icon: ComputerDesktopIcon },
  { key: "light",  label: "Light",  Icon: SunIcon },
  { key: "dark",   label: "Dark",   Icon: MoonIcon },
];

export default function ThemeSwitcher({ expanded }: { expanded: boolean }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") ?? "system"
  );

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const isDark = theme === "dark" || (theme === "system" && mq.matches);
      root.classList.toggle("dark", isDark);
    };
    apply();
    localStorage.setItem("theme", theme);
    if (theme === "system") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);

  const cycleTheme = () => {
    const currentIndex = themes.findIndex((t) => t.key === theme);
    setTheme(themes[(currentIndex + 1) % themes.length].key);
  };

  const { Icon: ActiveIcon, label: activeLabel } =
    themes.find((t) => t.key === theme) ?? themes[0];

  return (
    <>
      {/* Mobile: single cycling icon button */}
      <Tooltip text={`Theme: ${activeLabel}. Click to cycle.`} pos="right" className={`${expanded ? "hidden" : ""} md:hidden`}>
        <Button
          onClick={cycleTheme}
          aria-label={`Theme: ${activeLabel}. Click to cycle.`}
          className={`
            ${expanded ? "hidden" : ""} md:hidden flex items-center justify-center rounded-lg p-2.5 w-full
            bg-linear-to-r from-gray-100 to-gray-300 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200
            transition-all cursor-pointer
          `}
        >
          <ActiveIcon className="h-4 w-4" />
        </Button>
      </Tooltip>

      {/* Desktop: segmented ToggleGroup */}
      <ToggleGroup
        value={[theme]}
        onValueChange={(values) => {
          // ToggleGroup passes the full pressed-values array;
          // ignore deselection clicks (keep one always active)
          if (values.length > 0) setTheme(values[0]);
        }}
        aria-label="Theme"
        className={`${!expanded ? "hidden" : "inline-flex"} md:inline-flex items-center gap-0.5 rounded-lg bg-black/20 justify-stretch mb-0.5`}
        // bugfix for base-ui
        aria-orientation={undefined}
      >
        {themes.map(({ key, label, Icon }) => (
          <Toggle
            key={key}
            value={key}
            aria-label={label}
            className={`
              flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs
              transition-all cursor-pointer
              data-[pressed]:bg-white data-[pressed]:text-gray-900
              data-[pressed]:shadow-sm data-[pressed]:font-medium
              hover:text-gray-200 
              ${theme === key
                ? "bg-white text-gray-900 shadow-sm font-medium"
                : "text-gray-400"
              }
            `}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Toggle>
        ))}
      </ToggleGroup>
    </>
  );
}