"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme/theme-provider";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Initialize the component after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine if dark mode is active
  const isDark = theme === "dark";

  // Handle theme change when switch is toggled
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Prevent hydration mismatch by rendering a placeholder during SSR
  if (!mounted) {
    return <div className="w-16 h-6" />;
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Sun icon */}
      <Sun
        className={`size-4 transition-all duration-300 ease-in-out ${
          isDark
            ? "text-muted-foreground opacity-50 scale-90"
            : "text-amber-500 opacity-100 scale-110"
        }`}
      />

      {/* Custom switch */}
      <button
        onClick={toggleTheme}
        className={`
          relative w-12 h-6 rounded-full p-0.5 transition-colors duration-300 ease-in-out
          ${isDark ? "bg-[#034b6e]" : "bg-amber-400"}
        `}
        aria-label="Toggle theme"
      >
        {/* Track */}
        <span className="sr-only">Toggle theme</span>

        {/* Thumb with animated movement */}
        <span
          className="block h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out"
          style={{
            transform: isDark ? "translateX(24px)" : "translateX(0)",
            willChange: "transform",
          }}
        />
      </button>

      {/* Moon icon */}
      <Moon
        className={`size-4 transition-all duration-300 ease-in-out ${
          isDark
            ? "text-[#0ea5e9] opacity-100 scale-110"
            : "text-muted-foreground opacity-50 scale-90"
        }`}
      />
    </div>
  );
}
