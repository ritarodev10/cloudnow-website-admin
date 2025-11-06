"use client";

import * as React from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, addMonths, subMonths, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CalendarProps {
  month: Date;
  selectedDate?: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  onDateClick: (date: Date) => void;
  mode: "single" | "range";
  minDate?: Date;
  maxDate?: Date;
}

export function Calendar({
  month,
  selectedDate,
  selectedStartDate,
  selectedEndDate,
  onDateClick,
  mode,
  minDate,
  maxDate,
}: CalendarProps) {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const isDateSelected = (date: Date) => {
    if (mode === "single") {
      return selectedDate ? isSameDay(date, selectedDate) : false;
    } else {
      if (selectedStartDate && isSameDay(date, selectedStartDate)) return true;
      if (selectedEndDate && isSameDay(date, selectedEndDate)) return true;
      return false;
    }
  };

  const isDateInRange = (date: Date) => {
    if (mode !== "range" || !selectedStartDate || !selectedEndDate) return false;
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div
            key={index}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, month);
          const isSelected = isDateSelected(day);
          const inRange = isDateInRange(day);
          const disabled = isDateDisabled(day);
          const isTodayDate = isToday(day);

          return (
            <button
              key={index}
              type="button"
              onClick={() => !disabled && onDateClick(day)}
              disabled={disabled}
              className={cn(
                "h-9 w-9 rounded-md text-sm transition-colors",
                !isCurrentMonth && "text-muted-foreground/40",
                disabled && "opacity-50 cursor-not-allowed",
                !disabled && "hover:bg-accent hover:text-accent-foreground",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-semibold",
                inRange && !isSelected && "bg-primary/20",
                isTodayDate && !isSelected && "border border-primary"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface CalendarNavigationProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function CalendarNavigation({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
}: CalendarNavigationProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPreviousMonth}
        className="h-8 w-8"
      >
        <i className="ri-arrow-left-s-line h-4 w-4" />
      </Button>
      <div className="font-semibold text-base">
        {format(currentMonth, "MMMM yyyy")}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onNextMonth}
        className="h-8 w-8"
      >
        <i className="ri-arrow-right-s-line h-4 w-4" />
      </Button>
    </div>
  );
}

