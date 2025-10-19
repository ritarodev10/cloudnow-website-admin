"use client";

import { useCallback, useState } from "react";

import { GlobalSearch } from "@/components/global-search";
import { Footer } from "./footer";
import { Header } from "./header";
import { Sidebar } from "./sidebar/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [openSearch, setOpenSearch] = useState<(() => void) | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSetSearchRef = useCallback((openFn: () => void) => {
    setOpenSearch(() => openFn);
  }, []);

  const handleOpenSearch = useCallback(() => {
    if (openSearch) {
      openSearch();
    }
  }, [openSearch]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={handleToggleSidebar} />

      {/* Main Content Area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Fixed header */}
        <Header
          onOpenSearch={handleOpenSearch}
          onToggleSidebar={handleToggleSidebar}
          className="sticky top-0 z-40"
        />

        {/* Scrollable content area - takes remaining space */}
        <div className="flex-1 overflow-y-auto overscroll-behavior-contain">
          <div className="pt-4 pb-20">
            <main className="px-4 py-6 sm:px-6">{children}</main>
          </div>
        </div>

        {/* Fixed footer - positioned relative to viewport */}
        <Footer className="sticky bottom-0 z-30" />
      </div>

      <GlobalSearch setSearchRef={handleSetSearchRef} />
    </div>
  );
}
