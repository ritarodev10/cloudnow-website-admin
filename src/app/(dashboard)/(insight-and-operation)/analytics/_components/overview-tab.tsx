"use client";

import { useState, useMemo } from "react";
import { DateFilter, DateFilterPreset, DateRange, isPreset } from "@/components/general/date-filter";
import { OverviewMetrics } from "./overview-metrics";
import { TimeSeriesChart } from "./time-series-chart";
import { LocationCard } from "./location-card";
import { EnvironmentCard } from "./environment-card";
import { WorldMapComponent as WorldMap } from "./world-map";
import { WeeklyTrafficTracker } from "./weekly-traffic-tracker";
import { useAnalyticsOverview } from "../_hooks/queries/use-analytics-overview";
import { TimeRange } from "@/types/analytics";
import { format } from "date-fns";

export function OverviewTab() {
  const [dateFilter, setDateFilter] = useState<DateFilterPreset | DateRange>("24h");
  
  // Convert date filter to API params
  const apiParams = useMemo(() => {
    if (isPreset(dateFilter)) {
      // Map presets to TimeRange
      const rangeMap: Record<DateFilterPreset, TimeRange> = {
        today: "24h",
        "24h": "24h",
        thisWeek: "7d",
        "7d": "7d",
        thisMonth: "30d",
        "30d": "30d",
        "90d": "30d", // Fallback to 30d
        thisYear: "30d",
        "6m": "30d",
        "12m": "30d",
        allTime: "30d",
        custom: "custom",
      };
      return { range: rangeMap[dateFilter] || "24h" };
    } else {
      // Custom date range
      return {
        range: "custom" as TimeRange,
        startDate: format(dateFilter.startDate, "yyyy-MM-dd"),
        endDate: format(dateFilter.endDate, "yyyy-MM-dd"),
      };
    }
  }, [dateFilter]);

  const {
    data: overview,
    isLoading,
    error,
  } = useAnalyticsOverview(apiParams);

  // Get timeRange for components that still need it
  const timeRange: TimeRange = useMemo(() => {
    if (isPreset(dateFilter)) {
      const rangeMap: Record<DateFilterPreset, TimeRange> = {
        today: "24h",
        "24h": "24h",
        thisWeek: "7d",
        "7d": "7d",
        thisMonth: "30d",
        "30d": "30d",
        "90d": "30d",
        thisYear: "30d",
        "6m": "30d",
        "12m": "30d",
        allTime: "30d",
        custom: "custom",
      };
      return rangeMap[dateFilter] || "24h";
    }
    return "custom";
  }, [dateFilter]);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <DateFilter
            value={dateFilter}
            onChange={setDateFilter}
          />
        </div>
        <div className="text-center text-red-600">
          Error loading analytics data: {error.message}
        </div>
      </div>
    );
  }

  if (isLoading || !overview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <DateFilter
            value={dateFilter}
            onChange={setDateFilter}
          />
        </div>
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Filter */}
      <div className="flex items-center justify-end">
        <DateFilter
          value={dateFilter}
          onChange={setDateFilter}
        />
      </div>

      {/* Metrics Cards */}
      <OverviewMetrics overview={overview} />

      {/* Time Series Chart - Full Width */}
      <TimeSeriesChart data={overview.timeSeries} timeRange={timeRange} />

      {/* Location and Environment Cards - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LocationCard timeRange={timeRange} />
        <EnvironmentCard timeRange={timeRange} />
      </div>

      {/* World Map and Weekly Traffic Tracker - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 flex w-full">
          <WorldMap timeRange={timeRange} />
        </div>
        <div className="lg:col-span-1 flex w-full">
          <WeeklyTrafficTracker timeRange={timeRange} />
        </div>
      </div>
    </div>
  );
}
