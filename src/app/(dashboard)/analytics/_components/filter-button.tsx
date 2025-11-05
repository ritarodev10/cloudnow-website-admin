"use client";

import { Button } from "@/components/ui/button";

interface FilterButtonProps {
  onClick?: () => void;
}

export function FilterButton({ onClick }: FilterButtonProps) {
  return (
    <Button variant="outline" onClick={onClick}>
      <i className="ri-menu-line mr-2" />
      Filter
    </Button>
  );
}

