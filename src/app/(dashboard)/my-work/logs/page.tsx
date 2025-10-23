"use client";

import React, { useState, useEffect } from "react";
import { PageTitle } from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, CalendarIcon, PencilIcon } from "lucide-react";
import { TimelineCanvas } from "@/components/work-logs/timeline-canvas";
import { TimelineControls } from "@/components/work-logs/timeline-controls";
import { WorkSessionForm } from "@/components/work-logs/work-session-form";
import { TimerWidget } from "@/components/work-logs/timer-widget";
import { WeeklyCalendarView } from "@/components/work-logs/weekly-calendar-view";
import { MonthlySummaryView } from "@/components/work-logs/monthly-summary-view";
import {
  WorkSession,
  TimelineBlock,
  TimelineViewMode,
  TimerState,
  MonthlyDaySummary,
} from "@/types";
import {
  sampleWorkSessions,
  formatTimelineData,
  calculateTotalHours,
  calculateEarnings,
  loadTimerState,
  saveTimerState,
  getInitialTimerState,
  getWeekSessions,
  getMonthSummary,
} from "@/data/work-logs";
import { sampleStaff } from "@/data/staff-management";
import { minutesToTime, timeToMinutes } from "@/lib/work-log-utils";

export default function MyWorkLogsPage() {
  // Mock current user (in real app, this would come from auth context)
  const currentUser = sampleStaff[0]; // John Doe

  // State management
  const [sessions, setSessions] = useState<WorkSession[]>([]);
  const [timelineBlocks, setTimelineBlocks] = useState<TimelineBlock[]>([]);
  const [viewMode, setViewMode] = useState<TimelineViewMode>({
    type: "daily",
    date: "2025-10-15", // Middle of October for better testing
    zoom: 1,
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<
    Partial<WorkSession> | undefined
  >();
  const [timerState, setTimerState] = useState<TimerState>(
    getInitialTimerState()
  );
  const [monthlySummary, setMonthlySummary] = useState<MonthlyDaySummary[]>([]);

  // Load initial data
  useEffect(() => {
    // Load sessions for current date
    const todaySessions = sampleWorkSessions.filter(
      (session) =>
        session.staffId === currentUser.id && session.date === viewMode.date
    );
    setSessions(todaySessions);

    // Convert to timeline blocks
    const blocks = formatTimelineData(todaySessions);
    setTimelineBlocks(blocks);

    // Load timer state
    const savedTimerState = loadTimerState();
    setTimerState(savedTimerState);
  }, [currentUser.id, viewMode.date]);

  // Save timer state when it changes
  useEffect(() => {
    saveTimerState(timerState);
  }, [timerState]);

  // Calculate totals
  const totalHours = calculateTotalHours(sessions);
  const totalEarnings = calculateEarnings(sessions, currentUser.hourlyRate);

  // Timer functions
  const handleTimerStart = () => {
    const now = Date.now();
    setTimerState((prev) => ({
      ...prev,
      isRunning: true,
      startTime: now,
      isPaused: false,
    }));
  };

  const handleTimerPause = () => {
    const now = Date.now();
    const elapsed = timerState.startTime ? now - timerState.startTime : 0;
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: true,
      elapsedTime: prev.elapsedTime + elapsed,
      startTime: null,
    }));
  };

  const handleTimerStop = () => {
    const now = Date.now();
    const elapsed = timerState.startTime ? now - timerState.startTime : 0;
    const totalElapsed = timerState.elapsedTime + elapsed;

    // Create session from timer
    if (totalElapsed > 0) {
      const startTime = new Date(Date.now() - totalElapsed);
      const endTime = new Date();

      const newSession: Partial<WorkSession> = {
        id: `session-${Date.now()}`,
        staffId: currentUser.id,
        date: viewMode.date,
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
        description: timerState.currentSession?.description || "Timer session",
        project: timerState.currentSession?.project || "",
        category: timerState.currentSession?.category || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      handleSaveSession(newSession);
    }

    setTimerState(getInitialTimerState());
  };

  const handleTimerReset = () => {
    setTimerState(getInitialTimerState());
  };

  // Session management
  const handleSaveSession = (sessionData: Partial<WorkSession>) => {
    if (editingSession?.id) {
      // Update existing session
      setSessions((prev) =>
        prev.map((session) =>
          session.id === editingSession.id
            ? {
                ...session,
                ...sessionData,
                updatedAt: new Date().toISOString(),
              }
            : session
        )
      );
    } else {
      // Add new session
      const newSession: WorkSession = {
        id: `session-${Date.now()}`,
        staffId: currentUser.id,
        date: viewMode.date,
        startTime: sessionData.startTime || "09:00",
        endTime: sessionData.endTime || "17:00",
        description: sessionData.description || "",
        project: sessionData.project || "",
        category: sessionData.category || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSessions((prev) => [...prev, newSession]);
    }

    // Update timeline blocks
    const updatedSessions = editingSession?.id
      ? sessions.map((session) =>
          session.id === editingSession.id
            ? {
                ...session,
                ...sessionData,
                updatedAt: new Date().toISOString(),
              }
            : session
        )
      : [
          ...sessions,
          {
            id: `session-${Date.now()}`,
            staffId: currentUser.id,
            date: viewMode.date,
            startTime: sessionData.startTime || "09:00",
            endTime: sessionData.endTime || "17:00",
            description: sessionData.description || "",
            project: sessionData.project || "",
            category: sessionData.category || "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as WorkSession,
        ];

    const blocks = formatTimelineData(updatedSessions);
    setTimelineBlocks(blocks);

    setIsFormOpen(false);
    setEditingSession(undefined);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));

    const updatedSessions = sessions.filter(
      (session) => session.id !== sessionId
    );
    const blocks = formatTimelineData(updatedSessions);
    setTimelineBlocks(blocks);
  };

  const handleBlockCreate = (startTime: number, endTime: number) => {
    const newSession: Partial<WorkSession> = {
      staffId: currentUser.id,
      date: viewMode.date,
      startTime: minutesToTime(startTime),
      endTime: minutesToTime(endTime),
      description: "",
      project: "",
      category: "",
    };

    setEditingSession(newSession);
    setIsFormOpen(true);
  };

  const handleBlockClick = (blockId: string) => {
    const session = sessions.find((s) => s.id === blockId);
    if (session) {
      setEditingSession(session);
      setIsFormOpen(true);
    }
  };

  const handleViewModeChange = (newViewMode: TimelineViewMode) => {
    setViewMode(newViewMode);

    if (newViewMode.type === "daily") {
      // Load sessions for selected date
      const dateSessions = sampleWorkSessions.filter(
        (session) =>
          session.staffId === currentUser.id &&
          session.date === newViewMode.date
      );
      setSessions(dateSessions);

      const blocks = formatTimelineData(dateSessions);
      setTimelineBlocks(blocks);
    } else if (newViewMode.type === "weekly") {
      // Load sessions for entire week
      const weekSessions = getWeekSessions(newViewMode.date, currentUser.id);
      setSessions(weekSessions);
    } else if (newViewMode.type === "monthly") {
      // Calculate daily summaries for entire month
      const monthString = newViewMode.date.substring(0, 7); // YYYY-MM
      const monthSummary = getMonthSummary(monthString, currentUser.id);
      setMonthlySummary(monthSummary);
    }
  };

  const handleDateChange = (date: string) => {
    const newViewMode = { ...viewMode, date };
    handleViewModeChange(newViewMode);
  };

  const handleZoomChange = (zoom: number) => {
    setViewMode((prev) => ({ ...prev, zoom }));
  };

  return (
    <PageTitle
      title="My Work Logs"
      description="Record your daily work hours and manage your time"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsFormOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Session
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              /* TODO: Export functionality */
            }}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Timer Widget */}
        <TimerWidget
          timerState={timerState}
          onStart={handleTimerStart}
          onPause={handleTimerPause}
          onStop={handleTimerStop}
          onReset={handleTimerReset}
        />

        {/* Timeline Controls */}
        <TimelineControls
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onDateChange={handleDateChange}
          onZoomChange={handleZoomChange}
          onReset={handleTimerReset}
          totalHours={totalHours}
          totalEarnings={totalEarnings}
          hourlyRate={currentUser.hourlyRate}
        />

        {/* Conditional View Rendering */}
        {viewMode.type === "daily" && (
          <Card>
            <CardHeader>
              <CardTitle>Daily Timeline - {viewMode.date}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <TimelineCanvas
                  blocks={timelineBlocks}
                  onBlockCreate={handleBlockCreate}
                  onBlockClick={handleBlockClick}
                  viewMode="daily"
                  selectedDate={viewMode.date}
                  zoom={viewMode.zoom}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode.type === "weekly" && (
          <WeeklyCalendarView
            sessions={sessions}
            selectedWeek={viewMode.date}
            onSessionClick={handleBlockClick}
            onDateChange={handleDateChange}
          />
        )}

        {viewMode.type === "monthly" && (
          <MonthlySummaryView
            monthlySummary={monthlySummary}
            selectedMonth={viewMode.date}
            onDayClick={(date) => {
              setViewMode({ type: "daily", date, zoom: 1 });
            }}
          />
        )}

        {/* Session List - Only show in daily view */}
        {viewMode.type === "daily" && sessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sessions for {viewMode.date}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{session.description}</div>
                      <div className="text-sm text-gray-500">
                        {session.startTime} - {session.endTime}
                        {session.project && ` • ${session.project}`}
                        {session.category && ` • ${session.category}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium">
                          {Math.round(
                            ((timeToMinutes(session.endTime) -
                              timeToMinutes(session.startTime)) /
                              60) *
                              100
                          ) / 100}
                          h
                        </div>
                        <div className="text-sm text-gray-500">
                          $
                          {Math.round(
                            ((timeToMinutes(session.endTime) -
                              timeToMinutes(session.startTime)) /
                              60) *
                              currentUser.hourlyRate *
                              100
                          ) / 100}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingSession(session);
                          setIsFormOpen(true);
                        }}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Work Session Form */}
      <WorkSessionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingSession(undefined);
        }}
        onSave={handleSaveSession}
        onDelete={handleDeleteSession}
        session={editingSession}
        isEditing={!!editingSession?.id}
      />
    </PageTitle>
  );
}
