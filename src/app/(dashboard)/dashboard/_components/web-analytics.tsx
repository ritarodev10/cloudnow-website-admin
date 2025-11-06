"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsOverview, TimeRange, Visitor } from "@/types/analytics";
import { OverviewMetrics } from "../../(insight-and-operation)/analytics/_components/overview-metrics";
import { TimeSeriesChart } from "../../(insight-and-operation)/analytics/_components/time-series-chart";
import { TimeRangeSelector } from "../../(insight-and-operation)/analytics/_components/time-range-selector";
import { VisitorsList } from "./visitors-list";

interface WebAnalyticsProps {
  analytics: AnalyticsOverview | undefined;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onPrevious: () => void;
  onNext: () => void;
  visitors: Visitor[];
  isLoadingSessions: boolean;
  isLoadingAnalytics: boolean;
  error?: Error | null;
}

export function WebAnalytics({
  analytics,
  timeRange,
  onTimeRangeChange,
  onPrevious,
  onNext,
  visitors,
  isLoadingSessions,
  isLoadingAnalytics,
  error,
}: WebAnalyticsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Web Analytics</h2>
        <TimeRangeSelector
          value={timeRange}
          onChange={onTimeRangeChange}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      </div>
      {error ? (
        <div className="text-center text-red-600 py-4">
          Error loading analytics data: {error.message}
        </div>
      ) : isLoadingAnalytics || !analytics ? (
        <div className="text-center text-muted-foreground py-4">
          Loading analytics...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Metrics Cards */}
          <OverviewMetrics overview={analytics} />

          {/* Time Series Chart and Recent Visitors - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
            <div className="lg:col-span-3">
              <TimeSeriesChart
                data={analytics.timeSeries}
                timeRange={timeRange}
              />
            </div>
            <div className="lg:col-span-2">
              {isLoadingSessions ? (
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>Recent Visitors</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      Loading visitors...
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <VisitorsList visitors={visitors} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
