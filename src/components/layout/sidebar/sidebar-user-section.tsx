"use client";

import { MessageSquareTextIcon, SettingsIcon, UserIcon } from "lucide-react";

import { SidebarUser } from "@/types/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarUserSectionProps {
  user: SidebarUser;
}

export function SidebarUserSection({ user }: SidebarUserSectionProps) {
  return (
    <div className="flex-shrink-0 border-t pt-2 pb-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full focus:outline-none">
          <div className="flex items-center px-3 py-2 mx-3 rounded-md hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200">
            <div className="flex items-center justify-center bg-primary/10 rounded-full w-9 h-9 mr-3">
              <UserIcon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-grow text-left">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-[10px]">{user.role}</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          align="center"
          alignOffset={-40}
          className="w-56 p-1 shadow-md"
          style={{ transform: "translate(10px, -10px)" }}
        >
          <DropdownMenuItem className="py-2 px-3 rounded-sm">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2 px-3 rounded-sm">
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Account Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-2 px-3 rounded-sm">
            <MessageSquareTextIcon className="mr-2 h-4 w-4" />
            <span>Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500 focus:text-red-500 hover:text-red-500 hover:bg-red-50 py-2 px-3 rounded-sm">
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
