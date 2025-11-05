"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestimonialFilters, TestimonialCategory } from "@/types/testimonials";

const testimonialCategories: TestimonialCategory[] = [
  "Customer Success",
  "Product Review",
  "Service Quality",
  "Technical Support",
  "Implementation",
  "Partnership",
  "General Feedback",
];

interface TestimonialsFiltersProps {
  filters: TestimonialFilters;
  onFiltersChange: (filters: TestimonialFilters) => void;
}

export function TestimonialsFilters({
  filters,
  onFiltersChange,
}: TestimonialsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCategoryToggle = (category: TestimonialCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];

    onFiltersChange({
      ...filters,
      categories: newCategories,
    });
  };

  const handleRatingChange = (rating: string) => {
    onFiltersChange({
      ...filters,
      rating: rating === "all" ? null : parseInt(rating),
    });
  };

  const handleVisibilityChange = (visibility: string) => {
    onFiltersChange({
      ...filters,
      visibility: visibility as "all" | "visible" | "hidden",
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as "date" | "rating" | "name" | "company",
    });
  };

  const handleSortOrderChange = (sortOrder: string) => {
    onFiltersChange({
      ...filters,
      sortOrder: sortOrder as "asc" | "desc",
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      categories: [],
      rating: null,
      visibility: "all",
      sortBy: "date",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.rating !== null ||
    filters.visibility !== "all";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters & Sorting</CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-xs"
              >
                <i className="ri-close-line text-sm mr-1" />
                Clear Filters
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <i className="ri-filter-line text-sm mr-2" />
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Groups */}
          <div className="space-y-3">
            <Label>Groups</Label>
            <div className="flex flex-wrap gap-2">
              {testimonialCategories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    filters.categories.includes(category)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                  {filters.categories.includes(category) && (
                    <i className="ri-close-line ml-1 text-sm" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Rating and Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <Select
                value={filters.rating?.toString() || "all"}
                onValueChange={handleRatingChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                  <SelectItem value="4">4 stars</SelectItem>
                  <SelectItem value="3">3 stars</SelectItem>
                  <SelectItem value="2">2 stars</SelectItem>
                  <SelectItem value="1">1 star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={filters.visibility}
                onValueChange={handleVisibilityChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All testimonials</SelectItem>
                  <SelectItem value="visible">Visible only</SelectItem>
                  <SelectItem value="hidden">Hidden only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sortBy">Sort by</Label>
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date created</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Order</Label>
              <Select
                value={filters.sortOrder}
                onValueChange={handleSortOrderChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-4 border-t">
              <Label className="text-sm font-medium">Active Filters:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="text-xs">
                    Group: {category}
                  </Badge>
                ))}
                {filters.rating && (
                  <Badge variant="secondary" className="text-xs">
                    Rating: {filters.rating} stars
                  </Badge>
                )}
                {filters.visibility !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    Visibility: {filters.visibility}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
