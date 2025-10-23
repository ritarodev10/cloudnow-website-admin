"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyDaySummary } from "@/types";

interface MonthlySummaryViewProps {
  monthlySummary: MonthlyDaySummary[];
  selectedMonth: string;
  onDayClick: (date: string) => void;
}

export function MonthlySummaryView({
  monthlySummary,
  selectedMonth,
  onDayClick,
}: MonthlySummaryViewProps) {
  const monthDate = new Date(selectedMonth + "-01");
  const year = monthDate.getFullYear();
  const monthIndex = monthDate.getMonth();
  const monthName = monthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Get first day of month and calculate starting day of week
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysInMonth = lastDay.getDate();

  // Generate calendar grid
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(monthIndex + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const daySummary = monthlySummary.find(
      (summary) => summary.date === dateString
    );
    calendarDays.push({
      day,
      dateString,
      summary: daySummary || {
        date: dateString,
        totalHours: 0,
        sessionCount: 0,
      },
    });
  }

  // Calculate totals
  const totalHours = monthlySummary.reduce(
    (sum, day) => sum + day.totalHours,
    0
  );
  const totalSessions = monthlySummary.reduce(
    (sum, day) => sum + day.sessionCount,
    0
  );
  const workingDays = monthlySummary.filter((day) => day.totalHours > 0).length;

  const getDayColor = (hours: number) => {
    if (hours === 0) return "bg-gray-50 text-gray-400";
    if (hours < 4) return "bg-green-100 text-green-700";
    if (hours < 8) return "bg-blue-100 text-blue-700";
    return "bg-purple-100 text-purple-700";
  };

  const getDayIntensity = (hours: number) => {
    if (hours === 0) return "";
    if (hours < 2) return "opacity-60";
    if (hours < 4) return "opacity-80";
    if (hours < 8) return "opacity-100";
    return "opacity-100 ring-2 ring-purple-300";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{monthName}</CardTitle>
        <div className="flex gap-4 text-sm text-gray-600">
          <div>
            Total Hours:{" "}
            <span className="font-medium">{totalHours.toFixed(1)}h</span>
          </div>
          <div>
            Sessions: <span className="font-medium">{totalSessions}</span>
          </div>
          <div>
            Working Days: <span className="font-medium">{workingDays}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center text-sm font-medium text-gray-500"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((dayData, index) => {
            if (!dayData) {
              return <div key={index} className="h-16"></div>;
            }

            const { day, dateString, summary } = dayData;
            const isToday =
              dateString === new Date().toISOString().split("T")[0];
            const isWeekend =
              new Date(dateString).getDay() === 0 ||
              new Date(dateString).getDay() === 6;

            return (
              <div
                key={dateString}
                className={`h-16 border border-gray-200 rounded cursor-pointer hover:shadow-md transition-all ${getDayColor(
                  summary.totalHours
                )} ${getDayIntensity(summary.totalHours)} ${
                  isToday ? "ring-2 ring-blue-400" : ""
                } ${isWeekend ? "bg-gray-50" : ""}`}
                onClick={() => onDayClick(dateString)}
              >
                <div className="p-1 h-full flex flex-col">
                  <div className="text-sm font-medium">{day}</div>
                  <div className="flex-1 flex flex-col justify-center">
                    {summary.totalHours > 0 && (
                      <>
                        <div className="text-xs font-medium">
                          {summary.totalHours.toFixed(1)}h
                        </div>
                        {summary.sessionCount > 0 && (
                          <div className="text-xs opacity-75">
                            {summary.sessionCount} session
                            {summary.sessionCount !== 1 ? "s" : ""}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span>No work</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>1-4 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>4-8 hours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-100 rounded"></div>
            <span>8+ hours</span>
          </div>
          <div className="text-xs">
            Click on any day to switch to daily view
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



