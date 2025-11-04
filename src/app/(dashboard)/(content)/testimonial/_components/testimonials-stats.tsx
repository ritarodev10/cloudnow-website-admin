"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TestimonialStats } from "@/types/testimonials";
import { Users, Star, Eye, EyeOff, Folder, Link as LinkIcon } from "lucide-react";

interface TestimonialsStatsProps {
  stats: TestimonialStats;
}

export function TestimonialsStats({ stats }: TestimonialsStatsProps) {
  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Total Testimonials */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Testimonials</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All testimonials</p>
        </CardContent>
      </Card>

      {/* Average Rating */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatRating(stats.averageRating)}</div>
          <p className="text-xs text-muted-foreground">Out of 5 stars</p>
        </CardContent>
      </Card>

      {/* Visible Testimonials */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visible</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.visible}</div>
          <p className="text-xs text-muted-foreground">Public testimonials</p>
        </CardContent>
      </Card>

      {/* Hidden Testimonials */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hidden</CardTitle>
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.hidden}</div>
          <p className="text-xs text-muted-foreground">Private testimonials</p>
        </CardContent>
      </Card>

      {/* Total Groups */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Groups</CardTitle>
          <Folder className="h-4 w-4 text-muted-foreground" />
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

      {/* Usage Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usage</CardTitle>
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.usedGroups}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="default" className="text-xs">
              {stats.usedGroups} used
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {stats.unusedGroups} unused
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

