"use client";

import { useLogout } from "@/app/(auth)/_hooks/mutations/use-logout";

interface LogoutButtonProps {
  isCollapsed?: boolean;
}

export function LogoutButton({ isCollapsed = false }: LogoutButtonProps) {
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isLoading = logoutMutation.isPending;

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`
        flex items-center py-1 transition-all duration-150 w-full
        ${
          isCollapsed
            ? "justify-center rounded-lg px-0"
            : "gap-3 px-3 rounded-md"
        }
        text-sidebar-foreground hover:bg-sidebar-accent/50
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <i className="ri-logout-box-line text-lg shrink-0" />
      {!isCollapsed && (
        <span className="text-sm flex-1 text-left">
          {isLoading ? "Logging out..." : "Logout"}
        </span>
      )}
    </button>
  );
}
