"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowRightIcon, FileTextIcon, LayoutDashboardIcon, UsersIcon } from "lucide-react";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  const groupedResults = searchResults.reduce<Record<string, SearchResult[]>>((acc, result) => {
    const category = result.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(result);
    return acc;
  }, {});

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search for pages and sections</DialogDescription>
        </DialogHeader>
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.entries(groupedResults).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => {
                      window.location.href = item.href;
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-center">{item.icon}</div>
                    <span>{item.title}</span>
                    <div className="ml-auto flex h-5 w-5 items-center justify-center">
                      <ArrowRightIcon className="h-3 w-3 opacity-50" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
