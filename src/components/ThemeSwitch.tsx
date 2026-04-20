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

  return (
    <div
      role="group"
      aria-label="Theme"
      className="inline-flex items-center gap-0.5 rounded-lg p-1 bg-black/20 p-1"
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
              : "text-gray-500 hover:text-gray-50 dark:hover:text-gray-200"
            }
          `}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}