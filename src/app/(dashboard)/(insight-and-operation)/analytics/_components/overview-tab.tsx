"use client";

import { useState } from "react";
import { FilterButton } from "./filter-button";
import { TimeRangeSelector } from "./time-range-selector";
import { OverviewMetrics } from "./overview-metrics";
import { TimeSeriesChart } from "./time-series-chart";
import { LocationCard } from "./location-card";
import { EnvironmentCard } from "./environment-card";
import { WorldMapComponent as WorldMap } from "./world-map";
import { WeeklyTrafficTracker } from "./weekly-traffic-tracker";
import { useAnalyticsOverview } from "../_hooks/queries/use-analytics-overview";
import { TimeRange } from "@/types/analytics";

export function OverviewTab() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const {
    data: overview,
    isLoading,
    error,
  } = useAnalyticsOverview({
    range: timeRange,
  });

  const handlePrevious = () => {
    // TODO: Implement previous period navigation
    console.log("Previous period");
  };

  const handleNext = () => {
    // TODO: Implement next period navigation
    console.log("Next period");
  };

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log("Filter clicked");
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <FilterButton onClick={handleFilter} />
          <TimeRangeSelector
            value={timeRange}
            onChange={setTimeRange}
            onPrevious={handlePrevious}
            onNext={handleNext}
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
        <div className="flex items-center justify-between">
          <FilterButton onClick={handleFilter} />
          <TimeRangeSelector
            value={timeRange}
            onChange={setTimeRange}
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
      {/* Header with Filter and Time Range */}
      <div className="flex items-center justify-between">
        <FilterButton onClick={handleFilter} />
        <TimeRangeSelector
          value={timeRange}
          onChange={setTimeRange}
          onPrevious={handlePrevious}
          onNext={handleNext}
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
