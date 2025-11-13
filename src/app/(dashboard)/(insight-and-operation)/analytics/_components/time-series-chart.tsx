"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeSeriesDataPoint } from "@/types/analytics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { startOfHour, subHours, startOfDay, setHours, startOfWeek, addDays, endOfWeek, isSameDay } from "date-fns";

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  timeRange: "24h" | "7d" | "30d" | "custom";
  endAtStartOfCurrentHour?: boolean;
  isThisWeek?: boolean;
}

function formatTimeLabel(
  timestamp: string,
  timeRange: "24h" | "7d" | "30d" | "custom"
): string {
  try {
    const date = new Date(timestamp);

    if (timeRange === "24h") {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    if (timeRange === "7d") {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return timestamp;
  }
}

const chartColors = {
  // Use brand colors: primary blue for visitors, accent blue for views
  visitors: "#034b6e", // Brand primary color (dark blue)
  views: "#0a70a0", // Brand accent color (lighter blue)
};

export function TimeSeriesChart({ data, timeRange, endAtStartOfCurrentHour = false, isThisWeek = false }: TimeSeriesChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [chartHeight, setChartHeight] = useState(350);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight;
        if (height > 0) {
          // Use the container height but ensure minimum of 350px
          setChartHeight(Math.max(height, 350));
        }
      }
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for Recharts
  let chartData = data.map((point) => {
    const date = new Date(point.timestamp);
    const hours = date.getHours();

    return {
      timestamp: point.timestamp,
      label: formatTimeLabel(point.timestamp, timeRange),
      hour: hours,
      visitors: point.visitors,
      views: point.views,
    };
  });

  // For 7d range, fill in daily data points to ensure all 7 days (Sunday-Saturday) are shown
  // Only do this for "this week" mode, not "last 7 days"
  if (timeRange === "7d" && isThisWeek) {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
    const filledData = [];

    // Create daily data points for Sunday through Saturday
    for (let i = 0; i < 7; i++) {
      const dayDate = addDays(weekStart, i);
      const dayStart = startOfDay(dayDate);
      const dayKey = dayStart.toISOString();

      // Find and aggregate all existing data for this day
      const dayDataPoints = chartData.filter((item) => {
        const itemDate = new Date(item.timestamp);
        return isSameDay(itemDate, dayStart);
      });

      if (dayDataPoints.length > 0) {
        // Aggregate visitors and views for the day
        const aggregated = dayDataPoints.reduce(
          (acc, item) => ({
            ...acc,
            visitors: acc.visitors + (item.visitors || 0),
            views: acc.views + (item.views || 0),
          }),
          { visitors: 0, views: 0 }
        );

        filledData.push({
          timestamp: dayKey,
          label: formatTimeLabel(dayKey, timeRange),
          hour: 0,
          visitors: aggregated.visitors,
          views: aggregated.views,
        });
      } else {
        // No data for this day, use zero values
        filledData.push({
          timestamp: dayKey,
          label: formatTimeLabel(dayKey, timeRange),
          hour: 0,
          visitors: 0,
          views: 0,
        });
      }
    }
    chartData = filledData;
  }

  // For 24h range, fill in hourly data points
  if (timeRange === "24h") {
    const now = new Date();
    const filledData = [];

    let startTime: Date;
    let endTime: Date;
    let numBuckets: number;

    if (endAtStartOfCurrentHour) {
      // "Last 24 hours": end at start of current hour, start 24 hours before
      // We want to show the same hour at both ends (e.g., 8am-8am)
      endTime = startOfHour(now);
      startTime = subHours(endTime, 24);
      // Create 25 buckets to include both start and end hours (0-24 inclusive)
      numBuckets = 25;
    } else {
      // "Today": start from beginning of today (12:00 AM), end at 10:00 PM (22:00)
      startTime = startOfDay(now);
      endTime = setHours(startOfDay(now), 22); // 10:00 PM
      // Show 23 hours (0-22 inclusive): 12:00 AM to 10:00 PM
      numBuckets = 23;
    }

    // Create hourly data points
    for (let i = 0; i < numBuckets; i++) {
      const hourDate = new Date(startTime.getTime() + i * 60 * 60 * 1000);
      const hourStart = startOfHour(hourDate);
      const hour = hourStart.getHours();
      const hourKey = hourStart.toISOString();

      // Find existing data for this hour (within 1 hour window)
      const existing = chartData.find((item) => {
        const itemDate = new Date(item.timestamp);
        const timeDiff = Math.abs(itemDate.getTime() - hourStart.getTime());
        return timeDiff < 60 * 60 * 1000; // Within 1 hour
      });

      filledData.push(
        existing || {
          timestamp: hourKey,
          label: formatTimeLabel(hourKey, timeRange),
          hour: hour,
          visitors: 0,
          views: 0,
        }
      );
    }
    chartData = filledData;
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Traffic Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div ref={containerRef} className="h-full w-full">
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="label"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                style={{
                  fontSize: "12px",
                }}
                tickFormatter={(value, index) => {
                  // Show every 2 hours for 24h range (even hours: 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22)
                  if (timeRange === "24h") {
                    const point = chartData[index];
                    if (point && point.hour !== undefined) {
                      const isFirst = index === 0;
                      const isLast = index === chartData.length - 1;
                      
                      // For "Last 24 hours", always show the first and last labels (same hour at both ends)
                      if (endAtStartOfCurrentHour && (isFirst || isLast)) {
                        return value;
                      }
                      
                      // Show label only for even hours
                      // For "Today", also show first label if it's an even hour
                      if (point.hour % 2 === 0) {
                        return value;
                      }
                      
                      return "";
                    }
                    return "";
                  }
                  return value;
                }}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                tickLine={{ stroke: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--muted-foreground))" }}
                style={{
                  fontSize: "12px",
                }}
                domain={[0, "auto"]}
                allowDecimals={false}
                tickCount={6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
                labelStyle={{
                  color: "hsl(var(--foreground))",
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                }}
              />
              <Bar
                dataKey="visitors"
                fill={chartColors.visitors}
                name="Visitors"
                stackId="1"
              />
              <Bar
                dataKey="views"
                fill={chartColors.views}
                name="Views"
                stackId="1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
