"use client";

import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeeklyTraffic } from "../_hooks/queries/use-weekly-traffic";
import { TimeRange } from "@/types/analytics";

interface WeeklyTrafficTrackerProps {
  timeRange: TimeRange;
}

export function WeeklyTrafficTracker({ timeRange }: WeeklyTrafficTrackerProps) {
  const {
    data: weeklyData,
    maxVisitors,
    isLoading,
    error,
  } = useWeeklyTraffic({
    range: timeRange,
  });

  const [hoveredCell, setHoveredCell] = useState<{
    dayIndex: number;
    hourIndex: number;
    visitors: number;
    x: number;
    y: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Day labels (Sunday to Saturday)
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Hour labels (12am to 11pm)
  const hourLabels = useMemo(() => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      if (i === 0) {
        hours.push("12am");
      } else if (i < 12) {
        hours.push(`${i}am`);
      } else if (i === 12) {
        hours.push("12pm");
      } else {
        hours.push(`${i - 12}pm`);
      }
    }
    return hours;
  }, []);

  // Get color and size based on visitor count
  const getCellStyle = (visitors: number) => {
    if (!visitors || visitors === 0) {
      return {
        backgroundColor: "#e5e7eb", // Light gray for no data
        width: "8px",
        height: "8px",
        opacity: 0.3,
      };
    }

    // Calculate intensity (0 to 1)
    const intensity = Math.min(visitors / maxVisitors, 1);

    // Scale from light blue to dark blue
    // RGB values: from rgb(59, 130, 246) (light blue) to rgb(30, 64, 175) (dark blue)
    const r = Math.round(59 - intensity * 29); // 59 -> 30
    const g = Math.round(130 - intensity * 66); // 130 -> 64
    const b = Math.round(246 - intensity * 71); // 246 -> 175

    // Size: small (8px) to large (16px) based on intensity
    const size = 8 + intensity * 8;

    return {
      backgroundColor: `rgb(${r}, ${g}, ${b})`,
      width: `${size}px`,
      height: `${size}px`,
      opacity: 0.7 + intensity * 0.3, // 0.7 to 1.0
    };
  };

  if (error) {
    return (
      <Card className="h-full w-full flex flex-col">
        <CardHeader className="border-b">
          <CardTitle>Traffic</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="text-center text-red-600 text-sm py-4">
            Error loading traffic data: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="h-full w-full flex flex-col">
        <CardHeader className="border-b">
          <CardTitle>Traffic</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="text-center text-muted-foreground text-sm py-4">
            Loading traffic data...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full w-full flex flex-col gap-0">
      <CardHeader className="border-b">
        <CardTitle>Traffic</CardTitle>
      </CardHeader>
      <CardContent className="p-6 flex-1 flex flex-col">
        <div
          ref={containerRef}
          className="flex-1 w-full overflow-x-auto relative"
          onMouseLeave={() => setHoveredCell(null)}
        >
          <div className="w-full grid grid-cols-[48px_repeat(7,1fr)] gap-x-1 gap-y-0.5">
            {/* Day headers row - empty cell for hour column, then 7 day headers in order */}
            <div className="row-start-1"></div>
            {dayLabels.map((day) => (
              <div
                key={`header-${day}`}
                className="row-start-1 text-center text-xs font-medium text-muted-foreground mb-2"
              >
                {day}
              </div>
            ))}

            {/* Hour rows */}
            {hourLabels.map((hourLabel, hourIndex) => (
              <div key={`row-${hourIndex}`} className="contents">
                {/* Hour label */}
                <div className="text-xs text-muted-foreground text-right pr-2 flex items-center">
                  {hourLabel}
                </div>

                {/* Day cells */}
                {dayLabels.map((_, dayIndex) => {
                  const visitors = weeklyData[dayIndex]?.[hourIndex] || 0;
                  const cellStyle = getCellStyle(visitors);

                  return (
                    <div
                      key={`${dayIndex}-${hourIndex}`}
                      className="flex items-center justify-center min-h-[20px] relative"
                      onMouseEnter={(e) => {
                        if (visitors > 0) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const containerRect =
                            containerRef.current?.getBoundingClientRect();
                          if (containerRect) {
                            setHoveredCell({
                              dayIndex,
                              hourIndex,
                              visitors,
                              x:
                                rect.left - containerRect.left + rect.width / 2,
                              y: rect.top - containerRect.top,
                            });
                          }
                        }
                      }}
                      onMouseLeave={() => {
                        setHoveredCell(null);
                      }}
                    >
                      <div
                        className="rounded-full transition-all hover:scale-125 cursor-pointer"
                        style={cellStyle}
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Tooltip */}
          {hoveredCell && (
            <div
              className="absolute pointer-events-none z-50"
              style={{
                left: `${hoveredCell.x}px`,
                top: `${hoveredCell.y - 8}px`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded shadow-lg whitespace-nowrap">
                Visitors: {hoveredCell.visitors}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
