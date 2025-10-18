"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import {
  ArrowRightIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  SearchIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: "page" | "section";
  category?: string;
  title: string;
  icon?: React.ReactNode;
  href: string;
}

interface GlobalSearchProps {
  setSearchRef?: (openFn: () => void) => void;
}

export function GlobalSearch({ setSearchRef }: GlobalSearchProps) {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => {
    setOpen(true);
  }, []);

  // Expose the open function via ref
  useEffect(() => {
    if (setSearchRef) {
      setSearchRef(openSearch);
    }
  }, [setSearchRef, openSearch]);

  // Sample search results - in a real app, these would be dynamically generated
  const searchResults: SearchResult[] = [
    {
      id: "dashboard-1",
      type: "page",
      category: "General",
      title: "Dashboard 1",
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
      href: "/dashboard",
    },
    {
      id: "dashboard-2",
      type: "page",
      category: "General",
      title: "Dashboard 2",
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
      href: "/dashboard-2",
    },
    {
      id: "dashboard-3",
      type: "page",
      category: "General",
      title: "Dashboard 3",
      icon: <LayoutDashboardIcon className="h-4 w-4" />,
      href: "/dashboard-3",
    },
    {
      id: "tasks",
      type: "page",
      category: "General",
      title: "Tasks",
      icon: <FileTextIcon className="h-4 w-4" />,
      href: "/tasks",
    },
    {
      id: "users",
      type: "page",
      category: "General",
      title: "Users",
      icon: <UsersIcon className="h-4 w-4" />,
      href: "/users",
    },
  ];

  // Group results by category
  const groupedResults = searchResults.reduce<Record<string, SearchResult[]>>(
    (acc, result) => {
      const category = result.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(result);
      return acc;
    },
    {}
  );

  // Handle keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Search Dialog */}
      <div
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border bg-card shadow-lg transition-all duration-200 ease-in-out",
          open
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <div className="flex items-center border-b px-3">
            <SearchIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Type a command or search..."
              autoFocus
            />
            <button
              className="ml-auto flex h-6 w-6 items-center justify-center rounded-md border"
              onClick={() => setOpen(false)}
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <Command.Empty className="py-6 text-center text-sm">
              No results found.
            </Command.Empty>

            {Object.entries(groupedResults).map(([category, items]) => (
              <Command.Group key={category} heading={category}>
                {items.map((item) => (
                  <Command.Item
                    key={item.id}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-muted/50 aria-selected:bg-muted"
                    onSelect={() => {
                      window.location.href = item.href;
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span>{item.title}</span>
                    <div className="ml-auto flex h-5 w-5 items-center justify-center">
                      <ArrowRightIcon className="h-3 w-3 opacity-50" />
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </div>
    </>
  );
}
