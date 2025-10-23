"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkSession } from "@/types";
import { timeToMinutes } from "@/lib/work-log-utils";

interface WeeklyCalendarViewProps {
  sessions: WorkSession[];
  selectedWeek: string;
  onSessionClick: (sessionId: string) => void;
  onDateChange: (date: string) => void;
}

export function WeeklyCalendarView({
  sessions,
  selectedWeek,
  onSessionClick,
  onDateChange,
}: WeeklyCalendarViewProps) {
  // Get the start of the week (Monday)
  const startDate = new Date(selectedWeek);
  const dayOfWeek = startDate.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Sunday = 0
  startDate.setDate(startDate.getDate() + mondayOffset);

  // Generate week days
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    weekDays.push(date);
  }

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    if (!acc[session.date]) {
      acc[session.date] = [];
    }
    acc[session.date].push(session);
    return acc;
  }, {} as Record<string, WorkSession[]>);

  // Generate time slots (8 AM to 8 PM)
  const timeSlots: number[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    timeSlots.push(hour);
  }

  const getSessionPosition = (session: WorkSession) => {
    const startMinutes = timeToMinutes(session.startTime);
    const endMinutes = timeToMinutes(session.endTime);
    const startHour = Math.floor(startMinutes / 60);
    const endHour = Math.ceil(endMinutes / 60);

    // Only show sessions within our time range (8 AM - 8 PM)
    if (startHour < 8 || endHour > 20) return null;

    const top = ((startHour - 8) * 60 + (startMinutes % 60)) * 2; // 2px per minute
    const height = (endMinutes - startMinutes) * 2;

    return { top, height };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Weekly View - {weekDays[0].toLocaleDateString()} to{" "}
          {weekDays[6].toLocaleDateString()}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-2">
          {/* Time column */}
          <div className="space-y-0">
            <div className="h-8 text-sm font-medium text-gray-500">Time</div>
            {timeSlots.map((hour) => (
              <div
                key={hour}
                className="h-16 text-xs text-gray-400 flex items-start pt-1"
              >
                {hour === 8
                  ? "8 AM"
                  : hour === 12
                  ? "12 PM"
                  : hour === 16
                  ? "4 PM"
                  : hour === 20
                  ? "8 PM"
                  : ""}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => {
            const dateString = day.toISOString().split("T")[0];
            const daySessions = sessionsByDate[dateString] || [];
            const isToday =
              dateString === new Date().toISOString().split("T")[0];

            return (
              <div key={dateString} className="space-y-0">
                {/* Day header */}
                <div
                  className={`h-8 text-sm font-medium text-center cursor-pointer hover:bg-gray-100 rounded ${
                    isToday ? "bg-blue-100 text-blue-700" : "text-gray-700"
                  }`}
                  onClick={() => onDateChange(dateString)}
                >
                  <div>
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-xs">{day.getDate()}</div>
                </div>

                {/* Time slots */}
                <div className="relative h-[832px] border border-gray-200 rounded">
                  {/* Hour lines */}
                  {timeSlots.map((hour) => (
                    <div
                      key={hour}
                      className="absolute w-full border-t border-gray-100"
                      style={{ top: `${(hour - 8) * 64}px` }}
                    />
                  ))}

                  {/* Sessions */}
                  {daySessions.map((session) => {
                    const position = getSessionPosition(session);
                    if (!position) return null;

                    return (
                      <div
                        key={session.id}
                        className="absolute left-1 right-1 bg-blue-500 text-white text-xs p-1 rounded cursor-pointer hover:bg-blue-600 transition-colors"
                        style={{
                          top: `${position.top}px`,
                          height: `${position.height}px`,
                        }}
                        onClick={() => onSessionClick(session.id)}
                        title={`${session.description} (${session.startTime} - ${session.endTime})`}
                      >
                        <div className="truncate font-medium">
                          {session.description}
                        </div>
                        <div className="truncate opacity-90">
                          {session.startTime} - {session.endTime}
                        </div>
                        {session.project && (
                          <div className="truncate opacity-75">
                            {session.project}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Work Session</span>
          </div>
          <div className="text-xs">
            Click on a session to edit, or click on a day header to switch to
            daily view
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
