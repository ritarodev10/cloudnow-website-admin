"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceFilters } from "@/types";

interface ServicesSearchProps {
  filters: ServiceFilters;
  onFiltersChange: (filters: ServiceFilters) => void;
  onSearch: () => void;
}

export function ServicesSearch({ filters, onFiltersChange, onSearch }: ServicesSearchProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-sm">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search services..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10"
        />
      </div>
      <Button onClick={onSearch} variant="outline" size="sm">
        Search
      </Button>
    </div>
  );
}





