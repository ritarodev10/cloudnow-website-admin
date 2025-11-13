"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TagStats } from "@/types/tags";

interface TagsStatsProps {
  stats: TagStats;
}

export function TagsStats({ stats }: TagsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Tags */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tags</CardTitle>
          <i className="ri-price-tag-3-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All tags</p>
        </CardContent>
      </Card>

      {/* Total Usage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
          <i className="ri-links-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsage}</div>
          <p className="text-xs text-muted-foreground">Tag assignments</p>
        </CardContent>
      </Card>

      {/* Unused Tags */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unused Tags</CardTitle>
          <i className="ri-forbid-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.unused}</div>
          <p className="text-xs text-muted-foreground">Not in use</p>
        </CardContent>
      </Card>
    </div>
  );
}




