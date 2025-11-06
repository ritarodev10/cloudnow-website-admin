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
import { FAQFilters } from "@/types/faqs";
import { FAQGroup } from "@/types/faqs";

interface FAQsFiltersProps {
  filters: FAQFilters;
  onFiltersChange: (filters: FAQFilters) => void;
  groups: FAQGroup[];
}

export function FAQsFilters({
  filters,
  onFiltersChange,
  groups,
}: FAQsFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleGroupToggle = (groupId: string) => {
    const newGroups = filters.groups.includes(groupId)
      ? filters.groups.filter((g) => g !== groupId)
      : [...filters.groups, groupId];

    onFiltersChange({
      ...filters,
      groups: newGroups,
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as "date" | "order" | "question",
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
      groups: [],
      sortBy: "date",
      sortOrder: "desc",
    });
  };

  const hasActiveFilters = filters.groups.length > 0;

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
              {groups.map((group) => (
                <Badge
                  key={group.id}
                  variant={
                    filters.groups.includes(group.id)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => handleGroupToggle(group.id)}
                >
                  {group.groupName}
                  {filters.groups.includes(group.id) && (
                    <i className="ri-close-line ml-1 text-sm" />
                  )}
                </Badge>
              ))}
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
                  <SelectItem value="order">Order</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
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
                {filters.groups.map((groupId) => {
                  const group = groups.find((g) => g.id === groupId);
                  return (
                    <Badge key={groupId} variant="secondary" className="text-xs">
                      Group: {group?.groupName || groupId}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}




