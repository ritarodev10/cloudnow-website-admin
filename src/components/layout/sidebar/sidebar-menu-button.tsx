"use client";

import { HourglassIcon } from "lucide-react";
import Link from "next/link";

import { SidebarMenuItem } from "@/types/sidebar";
import {
  SidebarMenuButton,
  SidebarMenuItem as SidebarMenuItemComponent,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

interface SidebarMenuButtonProps {
  item: SidebarMenuItem;
}

export function SidebarMenuButtonComponent({ item }: SidebarMenuButtonProps) {
  const { icon: Icon, label, href, isAvailable } = item;

  if (isAvailable) {
    return (
      <SidebarMenuItemComponent>
        <SidebarMenuButton asChild>
          <Link href={href}>
            <Icon />
            <span>{label}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItemComponent>
    );
  }

  return (
    <SidebarMenuItemComponent>
      <SidebarMenuButton
        asChild
        className="opacity-60 hover:opacity-80 transition-opacity group"
      >
        <Link href={href} className="relative">
          <Icon className="group-hover:hidden" />
          <HourglassIcon className="hidden group-hover:block text-blue-400" />
          <span>{label}</span>
          <Badge
            variant="secondary"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-0.5"
          >
            Soon
          </Badge>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItemComponent>
  );
}
