"use client";

import * as React from "react";
import { useState } from "react";
import { format, addMonths, subMonths, startOfDay, endOfDay } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarNavigation } from "./calendar";
import { cn } from "@/lib/utils";

export type DatePickerMode = "single" | "range";

interface DatePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: DatePickerMode;
  onModeChange: (mode: DatePickerMode) => void;
  selectedDate?: Date;
  selectedStartDate?: Date;
  selectedEndDate?: Date;
  onApply: (date?: Date, startDate?: Date, endDate?: Date) => void;
}

export function DatePickerModal({
  open,
  onOpenChange,
  mode,
  onModeChange,
  selectedDate,
  selectedStartDate,
  selectedEndDate,
  onApply,
}: DatePickerModalProps) {
  const [leftMonth, setLeftMonth] = useState(selectedStartDate || selectedDate || new Date());
  const [rightMonth, setRightMonth] = useState(
    mode === "range" && selectedEndDate
      ? selectedEndDate
      : addMonths(selectedStartDate || selectedDate || new Date(), 1)
  );
  
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | undefined>(selectedDate);
  const [tempStartDate, setTempStartDate] = useState<Date | undefined>(selectedStartDate);
  const [tempEndDate, setTempEndDate] = useState<Date | undefined>(selectedEndDate);

  React.useEffect(() => {
    if (open) {
      setTempSelectedDate(selectedDate);
      setTempStartDate(selectedStartDate);
      setTempEndDate(selectedEndDate);
      setLeftMonth(selectedStartDate || selectedDate || new Date());
      setRightMonth(
        mode === "range" && selectedEndDate
          ? selectedEndDate
          : addMonths(selectedStartDate || selectedDate || new Date(), 1)
      );
    }
  }, [open, selectedDate, selectedStartDate, selectedEndDate, mode]);

  const handleDateClick = (date: Date) => {
    if (mode === "single") {
      setTempSelectedDate(date);
    } else {
      // Range mode
      if (!tempStartDate || (tempStartDate && tempEndDate)) {
        // Start new selection
        setTempStartDate(startOfDay(date));
        setTempEndDate(undefined);
      } else if (tempStartDate && !tempEndDate) {
        // Complete the range
        const start = tempStartDate;
        const end = endOfDay(date);
        if (date < start) {
          // If clicked date is before start, swap them
          setTempStartDate(end);
          setTempEndDate(start);
        } else {
          setTempEndDate(end);
        }
      }
    }
  };

  const handleApply = () => {
    if (mode === "single") {
      onApply(tempSelectedDate);
    } else {
      onApply(undefined, tempStartDate, tempEndDate);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTempSelectedDate(selectedDate);
    setTempStartDate(selectedStartDate);
    setTempEndDate(selectedEndDate);
    onOpenChange(false);
  };

  const handlePreviousLeftMonth = () => {
    setLeftMonth(subMonths(leftMonth, 1));
  };

  const handleNextLeftMonth = () => {
    setLeftMonth(addMonths(leftMonth, 1));
    if (rightMonth <= leftMonth) {
      setRightMonth(addMonths(leftMonth, 1));
    }
  };

  const handlePreviousRightMonth = () => {
    setRightMonth(subMonths(rightMonth, 1));
    if (leftMonth >= rightMonth) {
      setLeftMonth(subMonths(rightMonth, 1));
    }
  };

  const handleNextRightMonth = () => {
    setRightMonth(addMonths(rightMonth, 1));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0">
        <DialogHeader className="px-6 pt-5 pb-3 border-b">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onModeChange("single")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-t-md transition-colors",
                mode === "single"
                  ? "bg-background border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Single day
            </button>
            <button
              type="button"
              onClick={() => onModeChange("range")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-t-md transition-colors",
                mode === "range"
                  ? "bg-background border-b-2 border-primary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Date range
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4">
          {mode === "single" ? (
            <div className="flex flex-col items-center">
              <CalendarNavigation
                currentMonth={leftMonth}
                onPreviousMonth={handlePreviousLeftMonth}
                onNextMonth={handleNextLeftMonth}
              />
              <Calendar
                month={leftMonth}
                selectedDate={tempSelectedDate}
                onDateClick={handleDateClick}
                mode="single"
              />
            </div>
          ) : (
            <div className="flex gap-8">
              <div className="flex-1">
                <CalendarNavigation
                  currentMonth={leftMonth}
                  onPreviousMonth={handlePreviousLeftMonth}
                  onNextMonth={handleNextLeftMonth}
                />
                <Calendar
                  month={leftMonth}
                  selectedStartDate={tempStartDate}
                  selectedEndDate={tempEndDate}
                  onDateClick={handleDateClick}
                  mode="range"
                />
              </div>
              <div className="flex-1">
                <CalendarNavigation
                  currentMonth={rightMonth}
                  onPreviousMonth={handlePreviousRightMonth}
                  onNextMonth={handleNextRightMonth}
                />
                <Calendar
                  month={rightMonth}
                  selectedStartDate={tempStartDate}
                  selectedEndDate={tempEndDate}
                  onDateClick={handleDateClick}
                  mode="range"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Apply
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


