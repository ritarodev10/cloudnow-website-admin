"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsOverview } from "@/types/analytics";

interface OverviewMetricsProps {
  overview: AnalyticsOverview;
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}

export function OverviewMetrics({ overview }: OverviewMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Visitors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visitors</CardTitle>
          <i className="ri-user-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(overview.visitors.value)}</div>
          {overview.visitors.change !== 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className={overview.visitors.change > 0 ? "text-green-600" : "text-red-600"}>
                {overview.visitors.change > 0 ? "↑" : "↓"} {Math.abs(overview.visitors.change)}%
              </span>
            </p>
          )}
          {overview.visitors.change === 0 && (
            <p className="text-xs text-muted-foreground">↑ 0%</p>
          )}
        </CardContent>
      </Card>

      {/* Visits */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visits</CardTitle>
          <i className="ri-user-heart-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(overview.visits.value)}</div>
          {overview.visits.change !== 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className={overview.visits.change > 0 ? "text-green-600" : "text-red-600"}>
                {overview.visits.change > 0 ? "↑" : "↓"} {Math.abs(overview.visits.change)}%
              </span>
            </p>
          )}
          {overview.visits.change === 0 && (
            <p className="text-xs text-muted-foreground">↑ 0%</p>
          )}
        </CardContent>
      </Card>

      {/* Views */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Views</CardTitle>
          <i className="ri-eye-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(overview.views.value)}</div>
          {overview.views.change !== 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className={overview.views.change > 0 ? "text-green-600" : "text-red-600"}>
                {overview.views.change > 0 ? "↑" : "↓"} {Math.abs(overview.views.change)}%
              </span>
            </p>
          )}
          {overview.views.change === 0 && (
            <p className="text-xs text-muted-foreground">↑ 0%</p>
          )}
        </CardContent>
      </Card>

      {/* Bounce Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bounce rate</CardTitle>
          <i className="ri-arrow-left-right-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overview.bounceRate.value.toFixed(0)}%</div>
          {overview.bounceRate.change !== 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className={overview.bounceRate.change < 0 ? "text-green-600" : "text-red-600"}>
                {overview.bounceRate.change > 0 ? "↑" : "↓"} {Math.abs(overview.bounceRate.change)}%
              </span>
            </p>
          )}
          {overview.bounceRate.change === 0 && (
            <p className="text-xs text-muted-foreground text-red-600">0%</p>
          )}
        </CardContent>
      </Card>

      {/* Visit Duration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Visit duration</CardTitle>
          <i className="ri-time-line text-sm text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(overview.visitDuration.value)}</div>
          {overview.visitDuration.change !== 0 && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <span className={overview.visitDuration.change > 0 ? "text-green-600" : "text-red-600"}>
                {overview.visitDuration.change > 0 ? "↑" : "↓"} {Math.abs(overview.visitDuration.change)}%
              </span>
            </p>
          )}
          {overview.visitDuration.change === 0 && (
            <p className="text-xs text-muted-foreground text-red-600">0%</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

