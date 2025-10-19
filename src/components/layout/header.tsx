"use client";

import { SearchIcon } from "lucide-react";

import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { SidebarTrigger } from "./sidebar/sidebar-trigger";

interface HeaderProps {
  onOpenSearch?: () => void;
  onToggleSidebar?: () => void;
  className?: string;
}

export function Header({
  onOpenSearch,
  onToggleSidebar,
  className = "",
}: HeaderProps) {
  return (
    <header
      className={`bg-card/80 backdrop-blur-md sticky top-0 z-50 flex h-13.75 items-center gap-4 border-b border-border/50 px-4 py-2 sm:px-6 ${className}`}
    >
      <SidebarTrigger
        onClick={onToggleSidebar || (() => {})}
        className="[&_svg]:!size-5"
      />

      <div className="flex-1 flex items-center">
        <button
          onClick={onOpenSearch}
          className="flex items-center h-9 w-full max-w-[240px] gap-2 rounded-md border bg-background/80 px-3 text-sm text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground"
        >
          <SearchIcon className="h-4 w-4" />
          <span className="text-sm">Search</span>
          <div className="ml-auto flex">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </button>
      </div>

      <div className="flex items-center">
        <ThemeSwitcher />
      </div>
    </header>
  );
}
