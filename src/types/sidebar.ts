import { LucideIcon } from "lucide-react";

// Sidebar Types
export interface SidebarMenuItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  isAvailable: boolean;
  badge?: number;
  submenu?: SidebarMenuItem[];
}

export interface SidebarGroup {
  id: string;
  label: string;
  items: SidebarMenuItem[];
}

export interface SidebarUser {
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface SidebarConfig {
  groups: SidebarGroup[];
  user: SidebarUser;
}
