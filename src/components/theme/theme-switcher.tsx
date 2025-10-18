"use client";

import React, { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme/theme-provider";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = React.useState(false);

  // Initialize the switch state based on the current theme
  useEffect(() => {
    if (theme === "dark") {
      setChecked(true);
    } else if (theme === "light") {
      setChecked(false);
    } else {
      // If system theme, check the current system preference
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setChecked(isDarkMode);
    }
  }, [theme]);

  // Handle theme change when switch is toggled
  const handleThemeChange = (value: boolean) => {
    setChecked(value);
    setTheme(value ? "dark" : "light");
  };

  return (
    <div className="relative flex items-center space-x-3">
      <Sun
        className={`size-4 transition-all duration-200 ease-in-out ${
          checked
            ? "text-muted-foreground opacity-50 scale-90"
            : "text-amber-500 opacity-100 scale-110"
        }`}
      />
      <div className="relative">
        <Switch
          checked={checked}
          onCheckedChange={handleThemeChange}
          aria-label="Toggle theme"
          className="transition-transform duration-200 ease-in-out"
        />
      </div>
      <Moon
        className={`size-4 transition-all duration-200 ease-in-out ${
          checked
            ? "text-sky-400 opacity-100 scale-110"
            : "text-muted-foreground opacity-50 scale-90"
        }`}
      />
    </div>
  );
}
