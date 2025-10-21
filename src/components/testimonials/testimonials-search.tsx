"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TestimonialFilters } from "@/types/testimonials";
import { SearchIcon, X } from "lucide-react";

interface TestimonialsSearchProps {
  filters: TestimonialFilters;
  onFiltersChange: (filters: TestimonialFilters) => void;
}

export function TestimonialsSearch({ filters, onFiltersChange }: TestimonialsSearchProps) {
  const [searchValue, setSearchValue] = useState(filters.search);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onFiltersChange({
      ...filters,
      search: value,
    });
  };

  const clearSearch = () => {
    setSearchValue("");
    onFiltersChange({
      ...filters,
      search: "",
    });
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search by name, company, title, testimony content, or categories..."
        value={searchValue}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="pl-10 pr-10"
      />
      {searchValue && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          onClick={clearSearch}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
