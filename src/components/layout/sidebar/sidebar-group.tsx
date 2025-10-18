"use client";

import { SidebarGroup } from "@/types/sidebar";
import {
  SidebarGroup as SidebarGroupUI,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { SidebarMenuButtonComponent } from "./sidebar-menu-button";

interface SidebarGroupProps {
  group: SidebarGroup;
}

export function SidebarGroupComponent({ group }: SidebarGroupProps) {
  return (
    <SidebarGroupUI>
      {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {group.items.map((item) => (
            <SidebarMenuButtonComponent key={item.id} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroupUI>
  );
}
