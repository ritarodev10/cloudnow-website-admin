"use client";

import { PanelLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarTriggerProps {
  onClick: () => void;
  className?: string;
}

export function SidebarTrigger({
  onClick,
  className = "",
}: SidebarTriggerProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`size-7 ${className}`}
      onClick={onClick}
      aria-label="Toggle sidebar"
    >
      <PanelLeftIcon className="h-5 w-5" />
    </Button>
  );
}
