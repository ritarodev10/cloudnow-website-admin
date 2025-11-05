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

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  timeRange: "24h" | "7d" | "30d" | "custom";
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

export function TimeSeriesChart({ data, timeRange }: TimeSeriesChartProps) {
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

  // For 24h range, fill in all 24 hours with data points
  if (timeRange === "24h") {
    const now = new Date();
    const filledData = [];

    // Create 24 hourly data points (last 24 hours from now)
    for (let i = 23; i >= 0; i--) {
      const hourDate = new Date(now.getTime() - i * 60 * 60 * 1000);
      hourDate.setMinutes(0, 0, 0); // Set to start of hour

      const hour = hourDate.getHours();
      const hourKey = hourDate.toISOString();

      // Find existing data for this hour (within 1 hour window)
      const existing = chartData.find((item) => {
        const itemDate = new Date(item.timestamp);
        const timeDiff = Math.abs(itemDate.getTime() - hourDate.getTime());
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
                      // Show label only for even hours
                      return point.hour % 2 === 0 ? value : "";
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
