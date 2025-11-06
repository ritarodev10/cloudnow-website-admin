"use client";

import { Input } from "@/components/ui/input";

interface TagsSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TagsSearch({
  value,
  onChange,
  placeholder = "Search tags...",
}: TagsSearchProps) {
  return (
    <div className="relative">
      <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}



