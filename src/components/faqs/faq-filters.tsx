"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FAQFilters as FAQFiltersType, FAQCategory } from "@/types/faqs";
import { faqCategories } from "@/data/faqs";
import { X } from "lucide-react";

interface FAQFiltersProps {
  filters: FAQFiltersType;
  onFiltersChange: (filters: FAQFiltersType) => void;
}

export function FAQFilters({ filters, onFiltersChange }: FAQFiltersProps) {
  const handleCategoryToggle = (category: FAQCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      categories: [],
      visibility: "all",
      sortBy: "date",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.visibility !== "all" ||
    filters.sortBy !== "date" ||
    filters.sortOrder !== "desc";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Filters</Label>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Categories */}
        <div className="space-y-2">
          <Label className="text-sm">Categories</Label>
          <div className="flex flex-wrap gap-2">
            {faqCategories.map((category) => (
              <Badge
                key={category}
                variant={filters.categories.includes(category) ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
                {filters.categories.includes(category) && <X className="ml-1 h-3 w-3" />}
              </Badge>
            ))}
          </div>
        </div>

        {/* Visibility */}
        <div className="space-y-2">
          <Label className="text-sm">Visibility</Label>
          <Select
            value={filters.visibility}
            onValueChange={(value: "all" | "visible" | "hidden") =>
              onFiltersChange({
                ...filters,
                visibility: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All FAQs</SelectItem>
              <SelectItem value="visible">Visible only</SelectItem>
              <SelectItem value="hidden">Hidden only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <Label className="text-sm">Sort by</Label>
          <div className="flex gap-2">
            <Select
              value={filters.sortBy}
              onValueChange={(value: "date" | "question" | "category") =>
                onFiltersChange({
                  ...filters,
                  sortBy: value,
                })
              }
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="question">Question</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.sortOrder}
              onValueChange={(value: "asc" | "desc") =>
                onFiltersChange({
                  ...filters,
                  sortOrder: value,
                })
              }
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">↑</SelectItem>
                <SelectItem value="desc">↓</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
