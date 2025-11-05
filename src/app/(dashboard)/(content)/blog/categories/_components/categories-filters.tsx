"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryFilters } from "@/types/categories";

interface CategoriesFiltersProps {
  filters: CategoryFilters;
  onFiltersChange: (filters: CategoryFilters) => void;
}

export function CategoriesFilters({
  filters,
  onFiltersChange,
}: CategoriesFiltersProps) {
  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as CategoryFilters["sortBy"],
    });
  };

  const handleSortOrderChange = (sortOrder: string) => {
    onFiltersChange({
      ...filters,
      sortOrder: sortOrder as CategoryFilters["sortOrder"],
    });
  };

  const handleActiveOnlyToggle = () => {
    onFiltersChange({
      ...filters,
      activeOnly: !filters.activeOnly,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.sortBy !== "date" ||
    filters.sortOrder !== "desc" ||
    filters.activeOnly;

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      sortBy: "date",
      sortOrder: "desc",
      activeOnly: false,
    });
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Select value={filters.sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="posts">Posts Count</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant={filters.activeOnly ? "default" : "outline"}
        size="sm"
        onClick={handleActiveOnlyToggle}
      >
        <i className="ri-filter-line mr-2 text-sm" />
        Active Only
      </Button>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <i className="ri-close-line mr-2 text-sm" />
          Clear Filters
        </Button>
      )}

      {hasActiveFilters && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="text-xs">
              Search: {filters.search}
            </Badge>
          )}
          {filters.activeOnly && (
            <Badge variant="secondary" className="text-xs">
              Active Only
            </Badge>
          )}
          {filters.sortBy !== "date" && (
            <Badge variant="secondary" className="text-xs">
              Sort: {filters.sortBy}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

