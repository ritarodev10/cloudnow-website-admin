"use client";

import { motion } from "motion/react";
import { MenuCategory } from "@/lib/menu-config";
import { SidebarMenuItem } from "./sidebar-menu-item";
import { MenuBadge } from "./sidebar-menu-item";

interface SidebarGroupProps {
  category: MenuCategory;
  isCollapsed?: boolean;
  categoryIndex: number;
  isDesktop: boolean;
  prefersReducedMotion: boolean;
}

export function SidebarGroup({
  category,
  isCollapsed = false,
  categoryIndex,
  isDesktop,
  prefersReducedMotion,
}: SidebarGroupProps) {
  // Base delay for categories: starts at 0.2s (menu section delay) + category index
  const categoryBaseDelay = 0.2 + categoryIndex * 0.05;

  return (
    <motion.div
      initial={
        isDesktop && !prefersReducedMotion ? { opacity: 0, y: 10 } : false
      }
      animate={
        isDesktop && !prefersReducedMotion ? { opacity: 1, y: 0 } : false
      }
      transition={{
        duration: 0.4,
        delay: categoryBaseDelay,
        ease: [0.43, 0.13, 0.23, 0.96] as const,
      }}
      className="mb-6"
    >
      {/* Category header */}
      {!isCollapsed && (
        <motion.div
          initial={
            isDesktop && !prefersReducedMotion ? { opacity: 0, x: -10 } : false
          }
          animate={
            isDesktop && !prefersReducedMotion ? { opacity: 1, x: 0 } : false
          }
          transition={{
            duration: 0.3,
            delay: categoryBaseDelay + 0.05,
            ease: [0.43, 0.13, 0.23, 0.96] as const,
          }}
          className="px-4 py-2 mb-2 flex items-center justify-between"
        >
          <h3 className="text-xs text-sidebar-foreground/60 uppercase tracking-widest">
            {category.label}
          </h3>
          {category.comingSoon && (
            <MenuBadge
              badge={{ text: "Soon", variant: "warning" }}
              delay={categoryBaseDelay + 0.1}
              isDesktop={isDesktop}
              prefersReducedMotion={prefersReducedMotion}
            />
          )}
        </motion.div>
      )}

      {/* Menu items */}
      <div className="space-y-1">
        {category.items.map((item, itemIndex) => (
          <SidebarMenuItem
            key={item.label}
            item={item}
            isCollapsed={isCollapsed}
            itemIndex={itemIndex}
            categoryIndex={categoryIndex}
            baseDelay={categoryBaseDelay + 0.1}
            isDesktop={isDesktop}
            prefersReducedMotion={prefersReducedMotion}
            categoryComingSoon={category.comingSoon}
          />
        ))}
      </div>
    </motion.div>
  );
}
