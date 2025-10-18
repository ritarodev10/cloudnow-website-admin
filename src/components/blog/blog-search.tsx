import { FilterIcon, SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BlogSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onFilterClick?: () => void;
}

export function BlogSearch({
  searchTerm,
  onSearchChange,
  onFilterClick,
}: BlogSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          placeholder="Search posts..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button
        variant="outline"
        className="gap-2 whitespace-nowrap"
        onClick={onFilterClick}
      >
        <FilterIcon className="size-4" />
        <span>Filter</span>
      </Button>
    </div>
  );
}
