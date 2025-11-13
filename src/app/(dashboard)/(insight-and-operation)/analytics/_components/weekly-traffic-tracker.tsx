"use client";

import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWeeklyTraffic } from "../_hooks/queries/use-weekly-traffic";
import { TimeRange } from "@/types/analytics";
import {
  DateFilterPreset,
  DateRange,
  isPreset,
} from "@/components/general/date-filter";
import { startOfDay, startOfWeek, isBefore, isAfter } from "date-fns";

interface WeeklyTrafficTrackerProps {
  timeRange: TimeRange;
  dateFilter?: DateFilterPreset | DateRange;
  startDate?: string;
  endDate?: string;
}

export function WeeklyTrafficTracker({
  timeRange,
  dateFilter,
  startDate,
  endDate,
}: WeeklyTrafficTrackerProps) {
  const {
    data: weeklyData,
    maxVisitors,
    isLoading,
    error,
  } = useWeeklyTraffic({
    range: timeRange,
    startDate,
    endDate,
  });

  const [hoveredCell, setHoveredCell] = useState<{
    dayIndex: number;
    hourIndex: number;
    visitors: number;
    x: number;
    y: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate which cells should be visible based on date filter
  const { visibleCells, dayLabels, labelToDataIndex } = useMemo(() => {
    const now = new Date();
    const visible = new Set<string>();

    // Always use Sunday to Saturday order (matches API data structure)
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // Map label index to data index: Sun(0)->0, Mon(1)->1, ..., Sat(6)->6
    // Data structure: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const labelToDataMap = [0, 1, 2, 3, 4, 5, 6];

    if (!dateFilter) {
      // No filter - show all cells
      for (let labelIndex = 0; labelIndex < 7; labelIndex++) {
        const dataIndex = labelToDataMap[labelIndex];
        for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
          visible.add(`${labelIndex}-${hourIndex}`);
        }
      }
      return {
        visibleCells: visible,
        dayLabels: labels,
        labelToDataIndex: labelToDataMap,
      };
    }

    // Calculate date range
    let rangeStart: Date;
    let rangeEnd: Date;

    if (isPreset(dateFilter)) {
      switch (dateFilter) {
        case "today": {
          rangeStart = startOfDay(now);
          rangeEnd = now;
          break;
        }
        case "24h": {
          rangeStart = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          rangeEnd = now;
          break;
        }
        case "thisWeek": {
          rangeStart = startOfWeek(now, { weekStartsOn: 0 }); // Sunday
          rangeEnd = now;
          break;
        }
        case "7d": {
          rangeStart = startOfDay(
            new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000)
          );
          rangeEnd = now;
          break;
        }
        default: {
          // For other filters, show all cells
          for (let labelIndex = 0; labelIndex < 7; labelIndex++) {
            for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
              visible.add(`${labelIndex}-${hourIndex}`);
            }
          }
          return {
            visibleCells: visible,
            dayLabels: labels,
            labelToDataIndex: labelToDataMap,
          };
        }
      }
    } else {
      // Custom date range
      rangeStart = dateFilter.startDate;
      rangeEnd = dateFilter.endDate;
    }

    // Calculate which cells are within the date range
    // Iterate through label indices (0-6) and map to actual dates
    // Always start from Sunday (weekStartsOn: 0)
    for (let labelIndex = 0; labelIndex < 7; labelIndex++) {
      const dataIndex = labelToDataMap[labelIndex];

      // Get the date for this day in the current week
      // Week always starts on Sunday, label 0 = Sunday
      const weekStart = startOfWeek(now, { weekStartsOn: 0 });
      const dayDate = new Date(weekStart);

      // Calculate days to add based on label index
      // Label 0 (Sun) = 0 days, label 1 (Mon) = 1 day, ..., label 6 (Sat) = 6 days
      dayDate.setDate(dayDate.getDate() + labelIndex);
      const dayStart = startOfDay(dayDate);

      // Check if this day is within the range
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      // If the day is completely outside the range, skip it
      if (isAfter(dayStart, rangeEnd) || isBefore(dayEnd, rangeStart)) {
        continue;
      }

      // Check each hour in this day
      for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
        const hourDate = new Date(dayStart);
        hourDate.setHours(hourIndex, 0, 0, 0);
        const hourEnd = new Date(hourDate);
        hourEnd.setHours(hourIndex, 59, 59, 999);

        // Check if this hour is within the range
        // Hour is visible if it overlaps with the range at all
        const hourStartsBeforeRangeEnd = !isAfter(hourDate, rangeEnd);
        const hourEndsAfterRangeStart = !isBefore(hourEnd, rangeStart);

        if (hourStartsBeforeRangeEnd && hourEndsAfterRangeStart) {
          // This cell should be visible
          visible.add(`${labelIndex}-${hourIndex}`);
        }
      }
    }

    return {
      visibleCells: visible,
      dayLabels: labels,
      labelToDataIndex: labelToDataMap,
    };
  }, [dateFilter]);

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
                {dayLabels.map((_, labelIndex) => {
                  // Map label index to data index
                  const dataIndex = labelToDataIndex[labelIndex];
                  const visitors = weeklyData[dataIndex]?.[hourIndex] || 0;
                  const cellStyle = getCellStyle(visitors);
                  const isVisible = visibleCells.has(
                    `${labelIndex}-${hourIndex}`
                  );

                  // Debug logging for cells with data
                  if (visitors > 0 && hourIndex === 1 && labelIndex === 0) {
                    console.log("[WeeklyTrafficTracker] Cell data:", {
                      labelIndex,
                      label: dayLabels[labelIndex],
                      dataIndex,
                      hourIndex,
                      visitors,
                      isVisible,
                      weeklyDataForDay: weeklyData[dataIndex],
                    });
                  }

                  return (
                    <div
                      key={`${labelIndex}-${hourIndex}`}
                      className="flex items-center justify-center min-h-[20px] relative"
                      style={{ opacity: isVisible ? 1 : 0.2 }}
                      onMouseEnter={(e) => {
                        if (visitors > 0 && isVisible) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const containerRect =
                            containerRef.current?.getBoundingClientRect();
                          if (containerRect) {
                            setHoveredCell({
                              dayIndex: labelIndex,
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
                        className={`rounded-full transition-all ${
                          isVisible
                            ? "hover:scale-125 cursor-pointer"
                            : "cursor-not-allowed"
                        }`}
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
