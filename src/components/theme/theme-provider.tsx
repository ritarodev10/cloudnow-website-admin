"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  // Initialize with defaultTheme, will be updated in useEffect
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Initialize theme from localStorage only on the client side
  useEffect(() => {
    try {
      const savedTheme = localStorage?.getItem(storageKey) as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // If no saved theme, check system preference
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

        // Update the DOM to match the system preference
        document.documentElement.classList.toggle("dark", systemTheme === "dark");
      }
    } catch (error) {
      console.error("Failed to initialize theme:", error);
    }
  }, [storageKey]);

  // Apply theme changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove both theme classes
    root.classList.remove("light", "dark");

    // Apply the appropriate theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

      root.classList.add(systemTheme);
      root.style.colorScheme = systemTheme;
    } else {
      root.classList.add(theme);
      root.style.colorScheme = theme;
    }
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      // Initial check
      document.documentElement.classList.toggle("dark", mediaQuery.matches);

      // Update when system theme changes
      const listener = (event: MediaQueryListEvent) => {
        document.documentElement.classList.toggle("dark", event.matches);
        document.documentElement.style.colorScheme = event.matches ? "dark" : "light";
      };

      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      try {
        localStorage?.setItem(storageKey, theme);
      } catch (error) {
        console.error("Failed to save theme preference to localStorage:", error);
      }
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
