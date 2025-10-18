"use client";

import { useCallback, useState } from "react";

import { GlobalSearch } from "@/components/global-search";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Footer } from "./footer";
import { Header } from "./header";
import { Sidebar } from "./sidebar/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [openSearch, setOpenSearch] = useState<(() => void) | null>(null);

  const handleSetSearchRef = useCallback((openFn: () => void) => {
    setOpenSearch(() => openFn);
  }, []);

  const handleOpenSearch = useCallback(() => {
    if (openSearch) {
      openSearch();
    }
  }, [openSearch]);

  return (
    <div className="flex min-h-dvh w-full overflow-hidden">
      <SidebarProvider>
        <Sidebar />
        <div className="flex flex-1 flex-col h-screen relative">
          {/* Main content that scrolls beneath header and footer */}
          <div className="absolute inset-0 overflow-y-auto overscroll-behavior-contain">
            <div className="pt-[3.5rem] pb-[2.5rem]">
              <main className="px-4 py-6 sm:px-6">{children}</main>
            </div>
          </div>

          {/* Fixed header */}
          <Header
            onOpenSearch={handleOpenSearch}
            className="absolute top-0 left-0 right-0"
          />

          {/* Fixed footer */}
          <Footer className="absolute bottom-0 left-0 right-0" />
        </div>
        <GlobalSearch setSearchRef={handleSetSearchRef} />
      </SidebarProvider>
    </div>
  );
}
