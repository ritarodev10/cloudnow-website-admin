"use client";

import CloudNowLogo from "@/components/icons/CloudNowLogo";
import {
  Sidebar as SidebarComponent,
  SidebarContent,
} from "@/components/ui/sidebar";
import { SidebarGroupComponent } from "./sidebar-group";
import { SidebarUserSection } from "./sidebar-user-section";
import { sidebarConfig } from "@/data/sidebar-config";

export function Sidebar() {
  return (
    <SidebarComponent>
      <SidebarContent className="flex flex-col h-full max-h-screen">
        {/* Fixed logo section */}
        <div className="flex flex-col justify-center pt-4 pb-2">
          <CloudNowLogo width={200} variant="white" />
        </div>

        {/* Scrollable menu section */}
        <div className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-thin">
          {sidebarConfig.groups.map((group) => (
            <SidebarGroupComponent key={group.id} group={group} />
          ))}
        </div>

        {/* Fixed account section */}
        <SidebarUserSection user={sidebarConfig.user} />
      </SidebarContent>
    </SidebarComponent>
  );
}
