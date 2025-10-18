"use client";

import { AlertCircleIcon } from "lucide-react";
import Link from "next/link";

import { SidebarMenuItem } from "@/types/sidebar";
import {
  SidebarMenuButton,
  SidebarMenuItem as SidebarMenuItemComponent,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton
              asChild
              className="opacity-60 hover:opacity-80 transition-opacity"
            >
              <Link href={href} className="group">
                <Icon className="group-hover:hidden" />
                <AlertCircleIcon className="hidden group-hover:block text-amber-500" />
                <span>{label}</span>
              </Link>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Coming soon</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </SidebarMenuItemComponent>
  );
}
