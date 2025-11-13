"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryFilters } from "@/types/categories";

interface CategoriesSearchProps {
  filters: CategoryFilters;
  onFiltersChange: (filters: CategoryFilters) => void;
}

export function CategoriesSearch({
  filters,
  onFiltersChange,
}: CategoriesSearchProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value,
    });
  };

  const clearSearch = () => {
    onFiltersChange({
      ...filters,
      search: "",
    });
  };

  return (
    <div className="relative w-full max-w-sm">
      <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search categories by name or slug..."
        value={filters.search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {filters.search && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          onClick={clearSearch}
        >
          <i className="ri-close-line text-sm" />
        </Button>
      )}
    </div>
  );
}




