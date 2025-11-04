"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile, isSidebarOpen]);

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isSidebarOpen]);

  const handleToggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleCloseSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Route change animation for mobile: fade + 2-6px translate-Y, 160-200ms
  const routeAnimation = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        transition: { duration: 0.18, ease: [0.43, 0.13, 0.23, 0.96] as const },
      };

  // Desktop content entrance animation: slide from below + fade (450ms delay)
  const desktopContentAnimation = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: 0.5,
          delay: 0.45,
          ease: [0.43, 0.13, 0.23, 0.96] as const,
        },
      };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-transparent">
      {/* Desktop: Centered card container */}
      <div className="hidden lg:block min-h-screen">
        <div className="bg-sidebar overflow-hidden">
          <div className="flex h-screen">
            {/* Sidebar - always visible on desktop, inside card */}
            <Sidebar
              isOpen={true}
              onClose={handleCloseSidebar}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() =>
                setIsSidebarCollapsed(!isSidebarCollapsed)
              }
            />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {/* Main Content Area */}
              <div className="bg-[#F8F8F8] flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Local Header */}
                <Navbar
                  onToggleSidebar={handleToggleSidebar}
                  isSidebarOpen={!isSidebarCollapsed}
                  isSidebarCollapsed={isSidebarCollapsed}
                  onToggleCollapse={() =>
                    setIsSidebarCollapsed(!isSidebarCollapsed)
                  }
                />

                {/* Page Content - Scrollable */}
                <motion.main
                  {...desktopContentAnimation}
                  className="flex-1 overflow-y-auto overflow-x-hidden pr-4"
                >
                  {/* Content wrapper with padding to account for fixed header/footer */}
                  <div className="px-16 pt-24 pb-16 min-h-full">{children}</div>
                </motion.main>

                {/* Footer - Sticky with glassmorphism */}
                <Footer isSidebarCollapsed={isSidebarCollapsed} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Optional drawer (preserved) */}
      <div className="lg:hidden min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          isCollapsed={false}
        />
        <div className="flex flex-col min-h-screen">
          <Navbar
            onToggleSidebar={handleToggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              {...routeAnimation}
              className="flex-1 overflow-auto p-4 pb-20"
            >
              {/* Content wrapper */}
              <div className="bg-[#F8F8F8] rounded-xl shadow-sm p-4 pt-16 min-h-full">
                {children}
              </div>
            </motion.main>
          </AnimatePresence>
          {/* Footer - Sticky with glassmorphism */}
          <Footer />
        </div>
      </div>
    </div>
  );
}
