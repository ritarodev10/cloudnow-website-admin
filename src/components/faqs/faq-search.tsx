"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon, X } from "lucide-react";
import { FAQFilters } from "@/types/faqs";

interface FAQSearchProps {
  filters: FAQFilters;
  onFiltersChange: (filters: FAQFilters) => void;
}

export function FAQSearch({ filters, onFiltersChange }: FAQSearchProps) {
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
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search FAQs by question, answer, or category..."
        value={filters.search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {filters.search && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
