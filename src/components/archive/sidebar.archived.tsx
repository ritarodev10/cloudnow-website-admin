"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import CloudNowLogo from "@/components/icons/CloudNowLogo";
import { menuConfig } from "@/lib/menu-config";
import { SidebarGroup } from "@/components/ui/sidebar-group";
import { LogoutButton } from "@/components/logout-button";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch user email from server API route
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/user");
        if (response.ok) {
          const data = await response.json();
          setUserEmail(data.user?.email || null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const sidebarWidth = isMobile ? 320 : isCollapsed ? 80 : 288; // w-80=320px, w-20=80px, w-72=288px

  // Mobile slide-in variants (only for mobile drawer)
  const mobileSidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 30,
      },
    },
  };

  // Desktop: sticky sidebar inside card (no slide-in animation)
  // Mobile: fixed overlay drawer with slide-in
  const isDesktop = !isMobile;

  return (
    <>
      {/* Mobile Overlay - only on mobile */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-60 lg:hidden"
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        aria-label="Sidebar"
        variants={
          isMobile && !prefersReducedMotion ? mobileSidebarVariants : {}
        }
        initial={isMobile ? "closed" : false}
        animate={isMobile ? (isOpen ? "open" : "closed") : false}
        className={`
          ${
            isDesktop ? "sticky top-0 h-full" : "fixed top-0 left-0 h-full z-70"
          }
          bg-transparent
          overflow-hidden
          shrink-0
        `}
        style={{
          width: sidebarWidth,
        }}
      >
        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo Section */}
          <div className="px-4 py-5">
            <Link href="/dashboard" className="flex items-center gap-3">
              <CloudNowLogo
                width={isCollapsed ? 40 : 200}
                variant="default"
                className="drop-shadow-lg"
              />
            </Link>
          </div>

          {/* Scrollable Menu Section */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {menuConfig.map((category, categoryIndex) => (
              <SidebarGroup
                key={category.label}
                category={category}
                isCollapsed={isCollapsed}
                categoryIndex={categoryIndex}
                isDesktop={isDesktop}
                prefersReducedMotion={!!prefersReducedMotion}
              />
            ))}
          </div>

          {/* Account Box and Logout Button - Bottom of Sidebar */}
          <div className="border-t border-white/30 p-4 space-y-3">
            {!isCollapsed && userEmail && (
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-gray-50">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#005782] text-white text-sm font-medium">
                  {userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userEmail}
                  </p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
            )}
            {isCollapsed ? (
              <div className="flex justify-center">
                <LogoutButton />
              </div>
            ) : (
              <LogoutButton />
            )}
          </div>
        </div>
      </motion.nav>
    </>
  );
}
