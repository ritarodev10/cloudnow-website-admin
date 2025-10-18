"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme/theme-provider";
import { Switch } from "@/components/ui/switch";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Determine if dark mode is active
  const isDark = theme === "dark";

  // Initialize the component after mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle theme change when switch is toggled
  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  // Prevent hydration mismatch by rendering a placeholder during SSR
  if (!mounted) {
    return <div className="w-16 h-6" />;
  }

  return (
    <div className="flex items-center space-x-3">
      <Sun
        className={`size-4 transition-colors duration-300 ease-in-out ${
          isDark
            ? "text-muted-foreground opacity-50 scale-90"
            : "text-amber-500 opacity-100 scale-100"
        }`}
      />
      <Switch
        checked={isDark}
        onCheckedChange={handleThemeChange}
        aria-label="Toggle theme"
      />
      <Moon
        className={`size-4 transition-all duration-300 ease-in-out ${
          isDark
            ? "text-sky-400 opacity-100 scale-100"
            : "text-muted-foreground opacity-50 scale-90"
        }`}
      />
    </div>
  );
}
