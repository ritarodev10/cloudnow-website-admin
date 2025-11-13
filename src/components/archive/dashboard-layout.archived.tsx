"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Sidebar } from "./sidebar.archived";
import { Navbar } from "../layout/navbar";

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

  // Card mount animation: fade + micro-scale (0.985 → 1), 200-220ms ease-out
  const cardAnimation = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.985 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.21, ease: [0.43, 0.13, 0.23, 0.96] as const },
      };

  // Route change animation: fade + 2-6px translate-Y, 160-200ms
  const routeAnimation = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -4 },
        transition: { duration: 0.18, ease: [0.43, 0.13, 0.23, 0.96] as const },
      };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-transparent">
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(255, 255, 255)"
        gradientBackgroundEnd="rgb(255, 255, 255)"
        firstColor="135, 206, 250"
        secondColor="100, 181, 246"
        thirdColor="66, 165, 245"
        fourthColor="30, 144, 255"
        fifthColor="0, 87, 130"
        pointerColor="66, 165, 245"
        size="100%"
        blendingValue="soft-light"
        interactive={true}
      >
        {/* Desktop: Centered card container */}
        <div className="hidden lg:block min-h-screen">
          <div className="">
            <motion.div
              {...cardAnimation}
              className="backdrop-blur-2xl bg-gray-200/50 border border-gray-200/50 overflow-hidden"
            >
              <div className="flex h-[100vh]">
                {/* Sidebar - always visible on desktop, inside card */}
                <Sidebar
                  isOpen={true}
                  onClose={handleCloseSidebar}
                  isCollapsed={isSidebarCollapsed}
                  onToggleCollapse={() =>
                    setIsSidebarCollapsed(!isSidebarCollapsed)
                  }
                />
                <div className="p-4 flex-1 flex flex-col min-w-0">
                  {/* Main Content Area */}
                  <div className="bg-white rounded-xl border border-gray-200/90 flex-1 flex flex-col min-w-0">
                    {/* Local Header */}
                    <Navbar
                      onToggleSidebar={handleToggleSidebar}
                      isSidebarOpen={!isSidebarCollapsed}
                      isSidebarCollapsed={isSidebarCollapsed}
                      onToggleCollapse={() =>
                        setIsSidebarCollapsed(!isSidebarCollapsed)
                      }
                    />

                    {/* Page Content */}
                    <AnimatePresence mode="wait">
                      <motion.main
                        key={pathname}
                        {...routeAnimation}
                        className="flex-1 overflow-auto pr-4 pb-4"
                      >
                        {/* Solid white wrapper */}
                        <div className=" p-6 min-h-full">{children}</div>
                      </motion.main>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
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
                className="flex-1 overflow-auto p-4"
              >
                {/* Solid white wrapper */}
                <div className="bg-white rounded-xl shadow-sm p-4 min-h-full">
                  {children}
                </div>
              </motion.main>
            </AnimatePresence>
          </div>
        </div>
      </BackgroundGradientAnimation>
    </div>
  );
}








