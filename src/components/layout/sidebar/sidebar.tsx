"use client";

import { useState, useEffect } from "react";
import CloudNowLogo from "@/components/icons/CloudNowLogo";
import { SidebarGroupComponent } from "./sidebar-group";
import { SidebarUserSection } from "./sidebar-user-section";
import { sidebarConfig } from "@/data/sidebar-config";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-sidebar text-sidebar-foreground
          transition-all duration-300 ease-in-out
          border-r border-sidebar-border z-[70]
          ${
            isMobile
              ? `w-80 transform ${
                  isOpen ? "translate-x-0" : "-translate-x-full"
                }`
              : `w-64 ${isOpen ? "translate-x-0" : "-translate-x-full"}`
          }
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex flex-col justify-center pt-4 pb-2 px-4">
            <CloudNowLogo width={200} variant="white" />
          </div>

          {/* Scrollable Menu Section */}
          <div className="flex-grow overflow-y-auto overflow-x-hidden scrollbar-thin px-2">
            {sidebarConfig.groups.map((group) => (
              <SidebarGroupComponent key={group.id} group={group} />
            ))}
          </div>

          {/* User Section */}
          <div className="px-2 pb-4">
            <SidebarUserSection user={sidebarConfig.user} />
          </div>
        </div>
      </aside>
    </>
  );
}
