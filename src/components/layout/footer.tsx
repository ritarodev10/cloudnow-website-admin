"use client";

import { useState, useEffect } from "react";

interface FooterProps {
  isSidebarCollapsed?: boolean;
}

export function Footer({ isSidebarCollapsed = false }: FooterProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate left offset based on sidebar width
  // Desktop: 260px expanded, 80px collapsed
  // Mobile: 0px (sidebar is overlay)
  const leftOffset = isMobile ? 0 : isSidebarCollapsed ? 80 : 260;

  return (
    <footer
      className="fixed bottom-0 z-50 border-t border-gray-200/80 bg-white/20 backdrop-blur-xl px-6 py-4 transition-all duration-300 ease-in-out"
      style={{
        left: `${leftOffset}px`,
        right: 0,
      }}
    >
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <a
          href="https://cloudnowsolutions.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 transition-colors duration-150"
        >
          cloudnowsolutions.com
        </a>
        <span>•</span>
        <span>Admin Panel</span>
        <span>•</span>
        <span>© 2025</span>
      </div>
    </footer>
  );
}
