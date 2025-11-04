"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/app/(auth)/_hooks/queries/use-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { data: user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isClickModeRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Note: Logout is handled by LogoutButton component
  const handleLogout = () => {
    // This can be removed if not needed, or kept for consistency
    router.push("/login");
    router.refresh();
  };

  const clearUserTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    clearUserTimeout();
    // Only open on hover if not in click mode
    if (!isClickModeRef.current) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    // Only close on mouse leave if not in click mode
    if (!isClickModeRef.current) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150); // Small delay to prevent flickering
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Toggle click mode and open state
    const wasOpen = isOpen;
    isClickModeRef.current = !wasOpen;
    setIsOpen(!wasOpen);
  };

  const handleMenuMouseEnter = () => {
    // Keep menu open when hovering over it
    clearUserTimeout();
  };

  const handleMenuMouseLeave = () => {
    // Only close if not in click mode
    if (!isClickModeRef.current) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  // Reset click mode when dropdown closes via external event
  useEffect(() => {
    if (!isOpen && isClickModeRef.current) {
      // Small delay before resetting click mode to allow for hover interactions
      const resetTimeout = setTimeout(() => {
        isClickModeRef.current = false;
      }, 300);
      return () => clearTimeout(resetTimeout);
    }
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      clearUserTimeout();
    };
  }, []);

  // Show loading placeholder if user is not yet loaded
  const userInitials = user?.email
    ? user.email.split("@")[0].slice(0, 2).toUpperCase()
    : "U";

  // Always render something - show placeholder if user not loaded yet
  const displayUser = user || { email: null, avatarUrl: null };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative"
    >
      <DropdownMenu
        open={isOpen}
        onOpenChange={(open) => {
          // Only allow external closes if not in click mode
          if (!open && isClickModeRef.current) {
            // If click mode is active and trying to close, exit click mode
            isClickModeRef.current = false;
          }
          setIsOpen(open);
        }}
        modal={false}
      >
        <DropdownMenuTrigger asChild>
          <button
            onClick={handleClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/50 transition-colors "
            aria-label="User menu"
          >
            <div className="flex-col items-start text-left justify-end hidden sm:flex">
              <p className="text-sm font-medium text-gray-900 leading-none">
                {displayUser.email?.split("@")[0] || "User"}
              </p>
              <p className="text-xs text-gray-400 leading-none mt-0.5">Admin</p>
            </div>
            <Avatar className="h-9 w-9">
              <AvatarImage src={displayUser.avatarUrl || undefined} />
              <AvatarFallback
                className={`text-white text-sm font-medium ${
                  user ? "bg-[#005782]" : "bg-gray-400 animate-pulse"
                }`}
              >
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56"
          onMouseEnter={handleMenuMouseEnter}
          onMouseLeave={handleMenuMouseLeave}
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {displayUser.email?.split("@")[0] || "User"}
              </p>
              <p className="text-xs leading-none text-gray-500">
                {displayUser.email || "Loading..."}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <i className="ri-logout-box-line mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
