"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import CloudNowLogo from "@/components/icons/CloudNowLogo";
import { menuConfig, MenuCategory } from "@/lib/menu-config";
import { SidebarGroup } from "@/components/ui/sidebar-group";
import { LogoutButton } from "@/components/logout-button";
import { useTestimonialStore } from "@/stores/testimonial-store";
import { useTestimonials } from "@/app/(dashboard)/(content)/testimonial/_hooks/queries/use-testimonials";
import { useTags } from "@/app/(dashboard)/(content)/blog/tags/_hooks/queries/use-tags";
import { usePostStats } from "@/app/(dashboard)/(content)/blog/posts/_hooks/queries/use-post-stats";

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
  const prefersReducedMotion = useReducedMotion();
  const testimonialCountFromStore = useTestimonialStore((state) => state.count);

  // Use React Query to get testimonials count
  // This subscribes to the cache, so it updates automatically
  const { data: testimonialsData } = useTestimonials({
    enabled: testimonialCountFromStore === null, // Only fetch if not set from store
  });

  // Get count from testimonials data
  const testimonialsCount = testimonialsData ? testimonialsData.length : null;

  // Use store value if available, otherwise use React Query count
  const testimonialCount =
    testimonialCountFromStore ?? testimonialsCount ?? null;

  // Use React Query to get tags count
  // This subscribes to the cache, so it updates automatically
  const { data: tagsData } = useTags();

  // Get count from tags data
  const tagsCount = tagsData ? tagsData.length : null;

  // Use React Query to get posts stats
  // This subscribes to the cache, so it updates automatically
  const { data: postStatsData } = usePostStats();

  // Get total count from posts stats
  const postsCount = postStatsData ? postStatsData.total : null;

  // Create dynamic menu config with testimonial, tags, and posts count
  const dynamicMenuConfig = useMemo(() => {
    return menuConfig.map((category): MenuCategory => {
      if (category.label !== "Content") {
        return category;
      }

      return {
        ...category,
        items: category.items.map((item) => {
          // Update testimonial count
          if (item.label === "Testimonials" && item.badge && testimonialCount !== null) {
            return {
              ...item,
              badge: {
                ...item.badge,
                text: testimonialCount,
              },
            };
          }
          
          // Update tags count and posts count in Blog submenu
          if (item.label === "Blog" && item.submenu) {
            return {
              ...item,
              submenu: item.submenu.map((subItem) => {
                if (subItem.label === "Tags" && subItem.badge && tagsCount !== null) {
                  return {
                    ...subItem,
                    badge: {
                      ...subItem.badge,
                      text: tagsCount,
                    },
                  };
                }
                if (subItem.label === "All Posts" && subItem.badge && postsCount !== null) {
                  return {
                    ...subItem,
                    badge: {
                      ...subItem.badge,
                      text: postsCount,
                    },
                  };
                }
                return subItem;
              }),
            };
          }
          
          return item;
        }),
      };
    });
  }, [testimonialCount, tagsCount, postsCount]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sidebarWidth = isMobile ? 320 : isCollapsed ? 80 : 260; // w-80=320px, w-20=80px, w-72=288px

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

  // Desktop entrance animation: slide from left + fade (0ms)
  const desktopSidebarAnimation = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
        transition: {
          duration: 0.5,
          ease: [0.43, 0.13, 0.23, 0.96] as const,
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
        initial={
          isMobile
            ? "closed"
            : !prefersReducedMotion
            ? desktopSidebarAnimation.initial
            : false
        }
        animate={
          isMobile
            ? isOpen
              ? "open"
              : "closed"
            : !prefersReducedMotion
            ? desktopSidebarAnimation.animate
            : false
        }
        transition={isMobile ? undefined : desktopSidebarAnimation.transition}
        className={`
          ${
            isDesktop ? "sticky top-0 h-full" : "fixed top-0 left-0 h-full z-70"
          }
          bg-sidebar
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
          <motion.div
            initial={
              isDesktop && !prefersReducedMotion
                ? { opacity: 0, y: -10 }
                : false
            }
            animate={
              isDesktop && !prefersReducedMotion ? { opacity: 1, y: 0 } : false
            }
            transition={{
              duration: 0.4,
              delay: 0.1,
              ease: [0.43, 0.13, 0.23, 0.96] as const,
            }}
            className="px-4 py-5"
          >
            <Link href="/dashboard" className="flex items-center gap-3">
              <CloudNowLogo
                width={isCollapsed ? 40 : 200}
                variant="white"
                className="drop-shadow-lg"
              />
            </Link>
          </motion.div>

          {/* Scrollable Menu Section */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {dynamicMenuConfig.map((category, categoryIndex) => (
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

          {/* Logout Button - Bottom of Sidebar */}
          <motion.div
            initial={
              isDesktop && !prefersReducedMotion ? { opacity: 0, y: 10 } : false
            }
            animate={
              isDesktop && !prefersReducedMotion ? { opacity: 1, y: 0 } : false
            }
            transition={{
              duration: 0.4,
              delay: 0.3,
              ease: [0.43, 0.13, 0.23, 0.96] as const,
            }}
            className="border-t border-sidebar-border p-4"
          >
            <LogoutButton isCollapsed={isCollapsed} />
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
}
