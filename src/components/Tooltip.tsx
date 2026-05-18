import { useState, useRef } from "react";
 
type TooltipPosition = "top" | "bottom" | "left" | "right";
 
interface TooltipProps {
  children: React.ReactNode;
  text: string;
  pos?: TooltipPosition;
  className?: string;
  fullWidth?: boolean;
}
 
const positionStyles: Record<TooltipPosition, { tooltip: string; arrow: string }> = {
  top: {
    tooltip: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    arrow: "top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-zinc-800",
  },
  bottom: {
    tooltip: "top-full left-1/2 -translate-x-1/2 mt-2",
    arrow: "bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-zinc-800",
  },
  left: {
    tooltip: "right-full top-1/2 -translate-y-1/2 mr-2",
    arrow: "left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-zinc-800",
  },
  right: {
    tooltip: "left-full top-1/2 -translate-y-1/2 ml-2",
    arrow: "right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-zinc-800",
  },
};
 
export default function Tooltip({ children, text, pos = "top", className, fullWidth }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const styles = positionStyles[pos];

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(true);
    timerRef.current = setTimeout(() => setVisible(false), 2000);
  };

  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };
 
  return (
    <span
      className={`relative inline-flex ${fullWidth ? "w-full" : "max-w-full"}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <span
        role="tooltip"
        className={`
          pointer-events-none absolute z-50 whitespace-nowrap
          rounded-md bg-zinc-800 px-2.5 py-1.5
          text-xs font-medium tracking-wide text-white shadow-lg
          transition-all duration-150
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
          ${styles.tooltip}
          ${className}
        `}
      >
        {text}
        <span className={`absolute h-0 w-0 border-4 ${styles.arrow}`} />
      </span>
    </span>
  );
}