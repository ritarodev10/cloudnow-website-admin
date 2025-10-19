"use client";

import { SparklesIcon, ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SidebarMenuItem } from "@/types/sidebar";
import { Badge } from "@/components/ui/badge";

interface SidebarMenuButtonProps {
  item: SidebarMenuItem;
}

export function SidebarMenuButton({ item }: SidebarMenuButtonProps) {
  const { icon: Icon, label, href, isAvailable, submenu } = item;
  const pathname = usePathname();
  const isActive = pathname === href;
  const [isExpanded, setIsExpanded] = useState(false);

  const hasSubmenu = submenu && submenu.length > 0;

  if (isAvailable) {
    return (
      <div className="w-full">
        {/* Main menu item */}
        {hasSubmenu ? (
          // Menu item with submenu - no link, just toggle
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1 text-left">{label}</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-200 ease-in-out ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        ) : (
          // Regular menu item - with link
          <Link
            href={href}
            className={`
                flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full
                ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }
              `}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        )}

        {/* Submenu with smooth expand/collapse animation */}
        {hasSubmenu && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="mx-5 border-l border-sidebar-border pl-5 py-0.5">
              <div className="space-y-1">
                {submenu.map((subItem) => (
                  <Link
                    key={subItem.id}
                    href={subItem.href}
                    className={`
                      flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-3 text-sm transition-colors outline-hidden focus-visible:ring-2
                      ${
                        pathname === subItem.href
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                    `}
                  >
                    <span className="truncate">{subItem.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="group relative">
      <Link
        href={href}
        className={`
          flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
          opacity-60 hover:opacity-80 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
        `}
      >
        <Icon className="h-4 w-4 group-hover:hidden" />
        <SparklesIcon className="h-4 w-4 hidden group-hover:block text-yellow-500" />
        <span>{label}</span>
        <Badge
          variant="secondary"
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-0.5"
        >
          Soon
        </Badge>
      </Link>
    </div>
  );
}
