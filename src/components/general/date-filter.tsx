"use client";

import * as React from "react";
import { useState } from "react";
import {
  format,
  subDays,
  addDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subWeeks,
  subMonths,
  subYears,
  isToday,
} from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DatePickerModal, DatePickerMode } from "./date-picker-modal";
import { cn } from "@/lib/utils";

export type DateFilterPreset =
  | "today"
  | "24h"
  | "thisWeek"
  | "7d"
  | "thisMonth"
  | "30d"
  | "90d"
  | "thisYear"
  | "6m"
  | "12m"
  | "allTime"
  | "custom";

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateFilterProps {
  value?: DateFilterPreset | DateRange;
  onChange: (value: DateFilterPreset | DateRange) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  defaultPreset?: DateFilterPreset;
}

const presetLabels: Record<DateFilterPreset, string> = {
  today: "Today",
  "24h": "Last 24 hours",
  thisWeek: "This week",
  "7d": "Last 7 days",
  thisMonth: "This month",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  thisYear: "This year",
  "6m": "Last 6 months",
  "12m": "Last 12 months",
  allTime: "All time",
  custom: "Custom range",
};

function getPresetRange(preset: DateFilterPreset): DateRange {
  const now = new Date();
  const today = startOfDay(now);
  const end = endOfDay(now);

  switch (preset) {
    case "today":
      return { startDate: today, endDate: end };
    case "24h":
      return { startDate: subDays(now, 1), endDate: now };
    case "thisWeek":
      return { startDate: startOfWeek(now, { weekStartsOn: 0 }), endDate: end };
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
}

function formatDateRange(range: DateRange): string {
  return `${format(range.startDate, "MMM d, yyyy")} — ${format(
    range.endDate,
    "MMM d, yyyy"
  )}`;
}

export function isPreset(
  value: DateFilterPreset | DateRange
): value is DateFilterPreset {
  return typeof value === "string";
}

export function DateFilter({
  value,
  onChange,
  onPrevious,
  onNext,
  defaultPreset = "24h",
}: DateFilterProps) {
  const [currentValue, setCurrentValue] = useState<
    DateFilterPreset | DateRange
  >(value || defaultPreset);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<DatePickerMode>("range");

  React.useEffect(() => {
    if (value !== undefined) {
      setCurrentValue(value);
    }
  }, [value]);

  const currentRange = isPreset(currentValue)
    ? getPresetRange(currentValue)
    : currentValue;

  const displayText = isPreset(currentValue)
    ? presetLabels[currentValue]
    : formatDateRange(currentValue);

  const handlePresetSelect = (preset: DateFilterPreset) => {
    if (preset === "custom") {
      setIsPickerOpen(true);
      setPickerMode("range");
    } else {
      setCurrentValue(preset);
      onChange(preset);
    }
  };

  const handleDatePickerApply = (
    date?: Date,
    startDate?: Date,
    endDate?: Date
  ) => {
    if (pickerMode === "single" && date) {
      const range: DateRange = {
        startDate: startOfDay(date),
        endDate: endOfDay(date),
      };
      setCurrentValue(range);
      onChange(range);
    } else if (pickerMode === "range" && startDate && endDate) {
      const range: DateRange = {
        startDate: startOfDay(startDate),
        endDate: endOfDay(endDate),
      };
      setCurrentValue(range);
      onChange(range);
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else {
      // Default behavior: shift the current range backward
      const daysDiff = Math.ceil(
        (currentRange.endDate.getTime() - currentRange.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const newRange: DateRange = {
        startDate: subDays(currentRange.startDate, daysDiff + 1),
        endDate: subDays(currentRange.endDate, daysDiff + 1),
      };
      setCurrentValue(newRange);
      onChange(newRange);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      // Default behavior: shift the current range forward
      const daysDiff = Math.ceil(
        (currentRange.endDate.getTime() - currentRange.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const newRange: DateRange = {
        startDate: addDays(currentRange.startDate, daysDiff + 1),
        endDate: addDays(currentRange.endDate, daysDiff + 1),
      };
      setCurrentValue(newRange);
      onChange(newRange);
    }
  };

  const isCustomRange = !isPreset(currentValue);

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          className="h-9 w-9 rounded-md"
        >
          <i className="ri-arrow-left-s-line h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="h-9 w-9 rounded-md"
        >
          <i className="ri-arrow-right-s-line h-4 w-4" />
        </Button>

        {/* Date Range Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-9 px-3 border-blue-500",
                isCustomRange && "border-blue-500"
              )}
            >
              <i className="ri-calendar-line h-4 w-4 mr-2" />
              <span className="text-sm">{displayText}</span>
              <i className="ri-arrow-down-s-line h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => handlePresetSelect("today")}
              className={cn(
                isPreset(currentValue) &&
                  currentValue === "today" &&
                  "font-semibold"
              )}
            >
              {presetLabels.today}
              {isPreset(currentValue) && currentValue === "today" && (
                <i className="ri-check-line ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePresetSelect("24h")}
              className={cn(
                isPreset(currentValue) &&
                  currentValue === "24h" &&
                  "font-semibold"
              )}
            >
              {presetLabels["24h"]}
              {isPreset(currentValue) && currentValue === "24h" && (
                <i className="ri-check-line ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handlePresetSelect("thisWeek")}
              className={cn(
                isPreset(currentValue) &&
                  currentValue === "thisWeek" &&
                  "font-semibold"
              )}
            >
              {presetLabels.thisWeek}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePresetSelect("7d")}
              className={cn(
                isPreset(currentValue) &&
                  currentValue === "7d" &&
                  "font-semibold"
              )}
            >
              {presetLabels["7d"]}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handlePresetSelect("thisMonth")}
              className={cn(
                isPreset(currentValue) &&
                  currentValue === "thisMonth" &&
                  "font-semibold"
              )}
            >
              {presetLabels.thisMonth}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePresetSelect("30d")}
              className={cn(
                isPreset(currentValue) &&
                  currentValue === "30d" &&
                  "font-semibold"
              )}
            >
              {presetLabels["30d"]}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePresetSelect("90d")}
              className={cn(
                isPreset(currentValue) &&
                  currentValue === "90d" &&
                  "font-semibold"
              )}
            >
              {presetLabels["90d"]}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePresetSelect("thisYear")}
              className={cn(
                isPreset(currentValue) &&
                  currentValue === "thisYear" &&
                  "font-semibold"
              )}
            >
              {presetLabels.thisYear}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handlePresetSelect("6m")}
              className={cn(
                isPreset(currentValue) &&
                  currentValue === "6m" &&
                  "font-semibold"
              )}
            >
              {presetLabels["6m"]}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePresetSelect("12m")}
              className={cn(
                isPreset(currentValue) &&
                  currentValue === "12m" &&
                  "font-semibold"
              )}
            >
              {presetLabels["12m"]}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handlePresetSelect("allTime")}
              className={cn(
                isPreset(currentValue) &&
                  currentValue === "allTime" &&
                  "font-semibold"
              )}
            >
              {presetLabels.allTime}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handlePresetSelect("custom")}
              className={cn(isCustomRange && "font-semibold")}
            >
              {presetLabels.custom}
              {isCustomRange && <i className="ri-check-line ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Date Picker Modal */}
      <DatePickerModal
        open={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        mode={pickerMode}
        onModeChange={setPickerMode}
        selectedDate={
          pickerMode === "single" ? currentRange.startDate : undefined
        }
        selectedStartDate={
          pickerMode === "range" ? currentRange.startDate : undefined
        }
        selectedEndDate={
          pickerMode === "range" ? currentRange.endDate : undefined
        }
        onApply={handleDatePickerApply}
      />
    </>
  );
}
