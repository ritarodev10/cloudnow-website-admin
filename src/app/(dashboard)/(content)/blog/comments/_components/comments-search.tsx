"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommentFilters } from "@/types/comments";

interface CommentsSearchProps {
  filters: CommentFilters;
  onFiltersChange: (filters: CommentFilters) => void;
}

export function CommentsSearch({
  filters,
  onFiltersChange,
}: CommentsSearchProps) {
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
      <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground" />
      <Input
        placeholder="Search by author, content, or post title..."
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
          <i className="ri-close-line text-sm" />
        </Button>
      )}
    </div>
  );
}



