"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MenuItem, MenuSubItem, Badge } from "@/lib/menu-config";

interface SidebarMenuItemProps {
  item: MenuItem;
  isCollapsed?: boolean;
  itemIndex?: number;
  categoryIndex?: number;
  baseDelay?: number;
  isDesktop?: boolean;
  prefersReducedMotion?: boolean;
  categoryComingSoon?: boolean;
}

// Badge component with animation
export function MenuBadge({
  badge,
  delay = 0,
  isDesktop = false,
  prefersReducedMotion = false,
}: {
  badge: Badge;
  delay?: number;
  isDesktop?: boolean;
  prefersReducedMotion?: boolean;
}) {
  const variantStyles = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-cyan-100 text-cyan-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
  };

  const variant = badge.variant || "default";

  return (
    <motion.span
      initial={
        isDesktop && !prefersReducedMotion ? { opacity: 0, scale: 0.8 } : false
      }
      animate={
        isDesktop && !prefersReducedMotion ? { opacity: 1, scale: 1 } : false
      }
      transition={{
        duration: 0.3,
        delay: delay,
        ease: [0.43, 0.13, 0.23, 0.96] as const,
      }}
      className={`
        px-2 py-0.5 text-xs font-medium rounded-full
        ${variantStyles[variant]}
      `}
    >
      {badge.text}
    </motion.span>
  );
}

export function SidebarMenuItem({
  item,
  isCollapsed = false,
  itemIndex = 0,
  categoryIndex = 0,
  baseDelay = 0.2,
  isDesktop = false,
  prefersReducedMotion = false,
  categoryComingSoon = false,
}: SidebarMenuItemProps) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  // Determine if this item is coming soon
  const isItemComingSoon = item.comingSoon || categoryComingSoon;

  // Check if current path matches this item directly
  // For items with submenu, only highlight parent if its href matches directly
  // (not when a submenu item is active)
  const isActive = item.href === pathname;
  
  // Check if any submenu item is active (for auto-expansion only, not highlighting)
  const hasActiveSubmenu = hasSubmenu && item.submenu?.some((subItem) => subItem.href === pathname);

  // Auto-expand if active submenu item found
  useEffect(() => {
    if (hasActiveSubmenu) {
      setIsExpanded(true);
    }
  }, [hasActiveSubmenu]);

  const handleToggle = () => {
    if (hasSubmenu) {
      // Allow expansion even when coming soon for visual consistency
      setIsExpanded(!isExpanded);
    }
  };

  // Calculate delay for this menu item
  const menuItemDelay = baseDelay + itemIndex * 0.03;
  // Badge delay is after menu item appears
  const badgeDelay = menuItemDelay + 0.15;

  // Category header (no href, no submenu)
  if (!item.href && !hasSubmenu) {
    return (
      <motion.div
        initial={
          isDesktop && !prefersReducedMotion ? { opacity: 0, x: -10 } : false
        }
        animate={
          isDesktop && !prefersReducedMotion ? { opacity: 1, x: 0 } : false
        }
        transition={{
          duration: 0.3,
          delay: menuItemDelay,
          ease: [0.43, 0.13, 0.23, 0.96] as const,
        }}
        className="px-4 py-2 mt-4 first:mt-0"
      >
        <h3 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider">
          {item.label}
        </h3>
      </motion.div>
    );
  }

  // Menu item with submenu
  if (hasSubmenu) {
    return (
      <motion.div
        initial={
          isDesktop && !prefersReducedMotion ? { opacity: 0, x: -10 } : false
        }
        animate={
          isDesktop && !prefersReducedMotion ? { opacity: 1, x: 0 } : false
        }
        transition={{
          duration: 0.4,
          delay: menuItemDelay,
          ease: [0.43, 0.13, 0.23, 0.96] as const,
        }}
        className="mb-1"
      >
        <button
          onClick={handleToggle}
          className={`
            w-full flex items-center py-2.5 transition-all duration-150
            ${
              isCollapsed
                ? "justify-center rounded-lg px-0"
                : "gap-3 px-3 rounded-md"
            }
            ${
              isItemComingSoon
                ? "text-sidebar-foreground cursor-not-allowed"
                : isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }
          `}
        >
          <i
            className={`${item.icon} text-lg shrink-0 ${
              isItemComingSoon ? "opacity-60" : ""
            }`}
          />
          {!isCollapsed && (
            <>
              <span
                className={`flex-1 text-left text-sm ${
                  isItemComingSoon ? "opacity-60" : ""
                }`}
              >
                {item.label}
              </span>
              {(item.badge || (item.comingSoon && !categoryComingSoon)) && (
                <MenuBadge
                  badge={item.badge || { text: "Soon", variant: "warning" }}
                  delay={badgeDelay}
                  isDesktop={isDesktop}
                  prefersReducedMotion={prefersReducedMotion}
                />
              )}
              <motion.i
                className={`ri-arrow-down-s-line text-lg ${
                  isItemComingSoon ? "opacity-60" : ""
                }`}
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </>
          )}
        </button>

        <AnimatePresence>
          {isExpanded && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.2,
                ease: [0.43, 0.13, 0.23, 0.96] as const,
              }}
              className="overflow-hidden"
            >
              <div className="pl-8 mt-1 space-y-1 relative">
                {/* Tree ornament - vertical line */}
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  exit={{ scaleY: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.43, 0.13, 0.23, 0.96] as const,
                  }}
                  className="absolute left-9 top-0 bottom-2 w-px bg-sidebar-border origin-top"
                />

                {item.submenu?.map((subItem: MenuSubItem, index: number) => {
                  const isSubActive = subItem.href === pathname;
                  const isLast = index === item.submenu!.length - 1;
                  // Submenu item is coming soon if subItem.comingSoon OR parent item coming soon OR category coming soon
                  const isSubItemComingSoon =
                    subItem.comingSoon || isItemComingSoon;

                  return (
                    <div key={subItem.href} className="relative">
                      {/* Tree ornament - horizontal connector */}
                      <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ scaleX: 0, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.1 + index * 0.05,
                          ease: [0.43, 0.13, 0.23, 0.96] as const,
                        }}
                        className="absolute left-1 top-[18px] w-[12px] h-px bg-sidebar-border origin-left"
                        style={{
                          borderRadius: isLast ? "0 0 0 4px" : "0",
                        }}
                      />

                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -10, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.1 + index * 0.05,
                          ease: [0.43, 0.13, 0.23, 0.96] as const,
                        }}
                      >
                        {isSubItemComingSoon ? (
                          <div
                            className={`
                              flex items-center gap-3 ml-4 px-3 py-2 rounded-md text-sm transition-all duration-150
                              cursor-not-allowed pointer-events-none
                              text-sidebar-foreground
                            `}
                          >
                            <span className={`flex-1 opacity-60`}>
                              {subItem.label}
                            </span>
                            {subItem.comingSoon &&
                              !categoryComingSoon &&
                              !item.comingSoon && (
                                <MenuBadge
                                  badge={{ text: "Soon", variant: "warning" }}
                                />
                              )}
                          </div>
                        ) : (
                          <Link
                            href={subItem.href}
                            className={`
                              flex items-center gap-3 ml-4 px-3 py-2 rounded-md text-sm transition-all duration-150
                              ${
                                isSubActive
                                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                              }
                            `}
                          >
                            <span className="flex-1">{subItem.label}</span>
                            {subItem.badge && (
                              <MenuBadge badge={subItem.badge} />
                            )}
                          </Link>
                        )}
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Regular menu item (no submenu)
  return (
    <motion.div
      initial={
        isDesktop && !prefersReducedMotion ? { opacity: 0, x: -10 } : false
      }
      animate={
        isDesktop && !prefersReducedMotion ? { opacity: 1, x: 0 } : false
      }
      transition={{
        duration: 0.4,
        delay: menuItemDelay,
        ease: [0.43, 0.13, 0.23, 0.96] as const,
      }}
      className="mb-1"
    >
      {isItemComingSoon ? (
        <div
          className={`
            flex items-center py-2.5 transition-all duration-150
            ${
              isCollapsed
                ? "justify-center rounded-lg px-0"
                : "gap-3 px-3 rounded-md"
            }
            cursor-not-allowed pointer-events-none
            text-sidebar-foreground
          `}
        >
          <i className={`${item.icon} text-lg shrink-0 opacity-60`} />
          {!isCollapsed && (
            <>
              <span className="text-sm flex-1 opacity-60">{item.label}</span>
              {item.comingSoon && !categoryComingSoon && (
                <MenuBadge
                  badge={{ text: "Soon", variant: "warning" }}
                  delay={badgeDelay}
                  isDesktop={isDesktop}
                  prefersReducedMotion={prefersReducedMotion}
                />
              )}
            </>
          )}
        </div>
      ) : (
        <Link
          href={item.href!}
          className={`
            flex items-center py-2.5 transition-all duration-150
            ${
              isCollapsed
                ? "justify-center rounded-lg px-0"
                : "gap-3 px-3 rounded-md"
            }
            ${
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            }
          `}
        >
          <i className={`${item.icon} text-lg shrink-0`} />
          {!isCollapsed && (
            <>
              <span className="text-sm flex-1">{item.label}</span>
              {item.badge && (
                <MenuBadge
                  badge={item.badge}
                  delay={badgeDelay}
                  isDesktop={isDesktop}
                  prefersReducedMotion={prefersReducedMotion}
                />
              )}
            </>
          )}
        </Link>
      )}
    </motion.div>
  );
}
8;
