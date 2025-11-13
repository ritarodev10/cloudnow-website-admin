"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FAQStats } from "@/types/faqs";

interface FAQsStatsProps {
  stats: FAQStats;
}

export function FAQsStats({ stats }: FAQsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total FAQs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total FAQs</CardTitle>
          <i className="ri-questionnaire-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All FAQs</p>
        </CardContent>
      </Card>

      {/* Total Groups */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Groups</CardTitle>
          <i className="ri-folder-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalGroups}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="default" className="text-xs">
              {stats.activeGroups} active
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {stats.totalGroups - stats.activeGroups} inactive
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Active Groups */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
          <i className="ri-checkbox-circle-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeGroups}</div>
          <p className="text-xs text-muted-foreground">Currently active</p>
        </CardContent>
      </Card>

      {/* Used Groups */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Used Groups</CardTitle>
          <i className="ri-links-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.usedGroups}</div>
          <p className="text-xs text-muted-foreground">With usage paths</p>
        </CardContent>
      </Card>

      {/* Unused Groups */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unused Groups</CardTitle>
          <i className="ri-forbid-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.unusedGroups}</div>
          <p className="text-xs text-muted-foreground">No usage paths</p>
        </CardContent>
      </Card>
    </div>
  );
}





