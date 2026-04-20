// ThemeSwitcher.jsx
import { useEffect, useState } from "react";
import { ComputerDesktopIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const themes = [
  { key: "system", label: "System", Icon: ComputerDesktopIcon },
  { key: "light",  label: "Light",  Icon: SunIcon },
  { key: "dark",   label: "Dark",   Icon: MoonIcon },
];

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") ?? "system"
  );

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const isDark =
        theme === "dark" || (theme === "system" && mq.matches);
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
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex].key);
  };

  const { Icon: ActiveIcon, label: activeLabel } = themes.find((t) => t.key === theme) ?? themes[0];

  return (
    <>
      {/* Mobile: single cycling icon button */}
      <button
        onClick={cycleTheme}
        aria-label={`Theme: ${activeLabel}. Click to cycle.`}
        className={`
          sm:hidden flex items-center justify-center rounded-lg p-2.5
          bg-white text-gray-500 hover:text-gray-800 dark:hover:text-gray-200
          transition-all cursor-pointer
        `}
      >
        <ActiveIcon className="h-4 w-4" />
      </button>

      {/* Desktop: full segmented control */}
      <div
        role="group"
        aria-label="Theme"
        className="hidden sm:inline-flex items-center gap-0.5 rounded-lg p-1 bg-black/20"
      >
        {themes.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            aria-pressed={theme === key}
            className={`
              flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs transition-all cursor-pointer
              ${theme === key
                ? "bg-white text-gray-900 shadow-sm font-medium"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              }
            `}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>
    </>
  );
}