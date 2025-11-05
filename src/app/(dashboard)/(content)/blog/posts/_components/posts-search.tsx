"use client";

import { Input } from "@/components/ui/input";
import { PostFilters } from "@/types/posts";

interface PostsSearchProps {
  filters: PostFilters;
  onFiltersChange: (filters: PostFilters) => void;
}

export function PostsSearch({ filters, onFiltersChange }: PostsSearchProps) {
  return (
    <div className="relative">
      <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Search posts by title, excerpt, or content..."
        value={filters.search}
        onChange={(e) =>
          onFiltersChange({
            ...filters,
            search: e.target.value,
          })
        }
        className="pl-10 w-full md:w-[400px]"
      />
    </div>
  );
}

