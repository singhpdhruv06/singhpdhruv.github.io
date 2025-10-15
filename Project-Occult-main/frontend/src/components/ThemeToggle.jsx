import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

function ThemeToggle({ className = "" }) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const isDark = (resolvedTheme || theme) === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors backdrop-blur-sm hover:bg-accent hover:text-accent-foreground border-border ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
      <span className="uppercase tracking-wide">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

export default ThemeToggle;