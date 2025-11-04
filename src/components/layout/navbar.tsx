"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { UserMenu } from "./user-menu";

interface NavbarProps {
  onToggleSidebar: () => void;
  isSidebarOpen?: boolean; // Optional for backward compatibility
  isSidebarCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Navbar({
  onToggleSidebar,
  isSidebarCollapsed,
  onToggleCollapse,
}: NavbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Check if mobile for conditional toggle button
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Desktop entrance animation: slide from top + fade (250ms delay)
  const desktopNavbarAnimation = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: -30 },
        animate: { opacity: 1, y: 0 },
        transition: {
          duration: 0.5,
          delay: 0.25,
          ease: [0.43, 0.13, 0.23, 0.96] as const,
        },
      };

  // Calculate left offset based on sidebar width
  // Desktop: 260px expanded, 80px collapsed
  // Mobile: 0px (sidebar is overlay)
  const leftOffset = isMobile ? 0 : isSidebarCollapsed ? 80 : 260;

  return (
    <motion.header
      {...(isMobile ? {} : desktopNavbarAnimation)}
      className="fixed top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-gray-200/30 shadow-sm transition-all duration-300 ease-in-out"
      style={{
        left: `${leftOffset}px`,
        right: 0,
      }}
    >
      {/* Content wrapper */}
      <div className="relative z-10 flex items-center gap-4 px-6 h-14">
        {/* Sidebar Toggle Button - Mobile only */}
        {isMobile && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-150 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <i className="ri-menu-line text-xl" />
          </button>
        )}

        {/* Collapse Toggle Button - Desktop only, left side of search */}
        {!isMobile && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-150 hidden lg:flex"
            aria-label={
              isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            <i
              className={`ri-${
                isSidebarCollapsed ? "menu-unfold" : "menu-fold"
              }-line text-lg`}
            />
          </button>
        )}

        {/* Global Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <div className="relative flex items-center">
              <i className="ri-search-line absolute left-4 text-gray-500 text-lg pointer-events-none z-10" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className={`
                  w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 
                  rounded-lg pl-12 pr-4 py-2 text-sm
                  focus:ring-2 focus:ring-gray-300 focus:bg-white focus:border-gray-300 focus:outline-none
                  transition-all duration-150
                `}
              />
            </div>
          </div>
        </div>

        {/* User Avatar and Menu - Top Right */}
        <div className="flex items-center ml-auto">
          <UserMenu />
        </div>
      </div>
    </motion.header>
  );
}
