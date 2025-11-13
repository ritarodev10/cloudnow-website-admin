"use client";

import { useState, useMemo } from "react";
import {
  DateFilter,
  DateFilterPreset,
  DateRange,
  isPreset,
} from "@/components/general/date-filter";
import { OverviewMetrics } from "./overview-metrics";
import { TimeSeriesChart } from "./time-series-chart";
import { LocationCard } from "./location-card";
import { EnvironmentCard } from "./environment-card";
import { WorldMapComponent as WorldMap } from "./world-map";
import { WeeklyTrafficTracker } from "./weekly-traffic-tracker";
import { useAnalyticsOverview } from "../_hooks/queries/use-analytics-overview";
import { TimeRange } from "@/types/analytics";
import {
  format,
  subDays,
  addDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";
import { Button } from "@/components/ui/button";

export function OverviewTab() {
  const [dateFilter, setDateFilter] = useState<DateFilterPreset | DateRange>(
    "24h"
  );

  // Helper function to get current date range for a preset
  const getCurrentPresetRange = (preset: DateFilterPreset): DateRange => {
    const now = new Date();
    const today = startOfDay(now);
    const end = endOfDay(now);

    switch (preset) {
      case "today":
        return { startDate: today, endDate: end };
      case "24h":
        return { startDate: subDays(now, 1), endDate: now };
      case "thisWeek":
        return {
          startDate: startOfWeek(now, { weekStartsOn: 0 }),
          endDate: end,
        };
      case "7d":
        return { startDate: startOfDay(subDays(now, 6)), endDate: end };
      case "thisMonth":
        return { startDate: startOfMonth(now), endDate: end };
      case "30d":
        return { startDate: startOfDay(subDays(now, 29)), endDate: end };
      case "90d":
        return { startDate: startOfDay(subDays(now, 89)), endDate: end };
      case "thisYear":
        return { startDate: startOfYear(now), endDate: end };
      case "6m":
        return { startDate: startOfDay(subMonths(now, 6)), endDate: end };
      case "12m":
        return { startDate: startOfDay(subMonths(now, 12)), endDate: end };
      case "allTime":
        return { startDate: new Date(0), endDate: end };
      default:
        return { startDate: subDays(now, 1), endDate: now };
    }
  };

  // Navigation handlers for preset ranges
  const handlePrevious = () => {
    // Skip navigation for "custom" preset selection
    if (isPreset(dateFilter) && dateFilter === "custom") {
      return;
    }

    // Skip navigation for "allTime" as it doesn't make sense
    if (isPreset(dateFilter) && dateFilter === "allTime") {
      return;
    }

    let currentRange: DateRange;

    if (isPreset(dateFilter)) {
      // For presets, get the current range
      currentRange = getCurrentPresetRange(dateFilter);
    } else {
      // For DateRange (from previous navigation), use the existing range
      currentRange = dateFilter;
    }

    const daysDiff = Math.ceil(
      (currentRange.endDate.getTime() - currentRange.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const newRange: DateRange = {
      startDate: subDays(currentRange.startDate, daysDiff + 1),
      endDate: subDays(currentRange.endDate, daysDiff + 1),
    };

    setDateFilter(newRange);
  };

  const handleNext = () => {
    // Skip navigation for "custom" preset selection
    if (isPreset(dateFilter) && dateFilter === "custom") {
      return;
    }

    // Skip navigation for "allTime" as it doesn't make sense
    if (isPreset(dateFilter) && dateFilter === "allTime") {
      return;
    }

    let currentRange: DateRange;

    if (isPreset(dateFilter)) {
      // For presets, get the current range
      currentRange = getCurrentPresetRange(dateFilter);
    } else {
      // For DateRange (from previous navigation), use the existing range
      currentRange = dateFilter;
    }

    const daysDiff = Math.ceil(
      (currentRange.endDate.getTime() - currentRange.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const newRange: DateRange = {
      startDate: addDays(currentRange.startDate, daysDiff + 1),
      endDate: addDays(currentRange.endDate, daysDiff + 1),
    };

    setDateFilter(newRange);
  };

  // Convert date filter to API params
  const apiParams = useMemo(() => {
    if (isPreset(dateFilter)) {
      const now = new Date();

      // Differentiate Today/This week/This month by using custom ranges
      // This allows Today to include partial current hour, and week/month to include partial today
      if (dateFilter === "today") {
        // Today: start of today to now (includes partial current hour)
        return {
          range: "custom" as TimeRange,
          startDate: startOfDay(now).toISOString(),
          endDate: now.toISOString(),
        };
      } else if (dateFilter === "thisWeek") {
        // This week: start of week to now (includes partial today)
        return {
          range: "custom" as TimeRange,
          startDate: startOfWeek(now, { weekStartsOn: 0 }).toISOString(),
          endDate: now.toISOString(),
        };
      } else if (dateFilter === "thisMonth") {
        // This month: start of month to now (includes partial today)
        return {
          range: "custom" as TimeRange,
          startDate: startOfMonth(now).toISOString(),
          endDate: now.toISOString(),
        };
      }

      // Handle "24h" - last 24 hours
      if (dateFilter === "24h") {
        return {
          range: "24h" as TimeRange,
          startDate: subDays(now, 1).toISOString(),
          endDate: now.toISOString(),
        };
      }

      // Handle "7d" - last 7 days
      if (dateFilter === "7d") {
        return {
          range: "7d" as TimeRange,
          startDate: startOfDay(subDays(now, 6)).toISOString(),
          endDate: now.toISOString(),
        };
      }

      // Map other presets to TimeRange
      const rangeMap: Record<DateFilterPreset, TimeRange> = {
        today: "24h", // Should not reach here due to check above
        "24h": "24h", // Should not reach here due to check above
        thisWeek: "7d", // Should not reach here due to check above
        "7d": "7d", // Should not reach here due to check above
        thisMonth: "30d", // Should not reach here due to check above
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
      // Custom date range - use ISO strings to preserve time components
      return {
        range: "custom" as TimeRange,
        startDate: dateFilter.startDate.toISOString(),
        endDate: dateFilter.endDate.toISOString(),
      };
    }
  }, [dateFilter]);

  const {
    data: overview,
    isLoading,
    error,
    refetch,
    isRefetching,
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
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="text-center text-red-600">
            Error loading analytics data: {error.message}
          </div>
          <Button
            onClick={() => refetch()}
            disabled={isRefetching}
            variant="outline"
          >
            {isRefetching ? "Retrying..." : "Retry"}
          </Button>
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
            onPrevious={handlePrevious}
            onNext={handleNext}
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
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>

      {/* Metrics Cards */}
      <OverviewMetrics overview={overview} />

      {/* Time Series Chart - Full Width */}
      <TimeSeriesChart
        data={overview.timeSeries}
        timeRange={timeRange}
        endAtStartOfCurrentHour={isPreset(dateFilter) && dateFilter === "24h"}
        isThisWeek={isPreset(dateFilter) && dateFilter === "thisWeek"}
      />

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
          <WeeklyTrafficTracker
            timeRange={timeRange}
            dateFilter={dateFilter}
            startDate={apiParams.startDate}
            endDate={apiParams.endDate}
          />
        </div>
      </div>
    </div>
  );
}
