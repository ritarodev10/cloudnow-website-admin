"use client";

import { SidebarGroup } from "@/types/sidebar";
import { SidebarMenuButton } from "./sidebar-menu-button";

interface SidebarGroupProps {
  group: SidebarGroup;
}

export function SidebarGroupComponent({ group }: SidebarGroupProps) {
  return (
    <div className="mb-4">
      {group.label && (
        <div className="px-3 py-2 text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
          {group.label}
        </div>
      )}
      <div className="space-y-1">
        {group.items.map((item) => (
          <SidebarMenuButton key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
