"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayIcon, PauseIcon, SquareIcon, ClockIcon } from "lucide-react";
import { TimerState } from "@/types";
import { formatElapsedTime } from "@/lib/work-log-utils";

interface TimerWidgetProps {
  timerState: TimerState;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
  className?: string;
}

export function TimerWidget({
  timerState,
  onStart,
  onPause,
  onStop,
  onReset,
  className = "",
}: TimerWidgetProps) {
  const [displayTime, setDisplayTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timerState.isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = timerState.startTime ? now - timerState.startTime : 0;
        setDisplayTime(elapsed);
      }, 1000);
    } else {
      setDisplayTime(timerState.elapsedTime);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState.isRunning, timerState.startTime, timerState.elapsedTime]);

  const getStatusColor = () => {
    if (timerState.isRunning) return "bg-green-100 text-green-800";
    if (timerState.isPaused) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusText = () => {
    if (timerState.isRunning) return "Running";
    if (timerState.isPaused) return "Paused";
    return "Stopped";
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClockIcon className="h-5 w-5 text-gray-500" />
            <div>
              <div className="text-2xl font-mono font-bold text-gray-900">
                {formatElapsedTime(displayTime)}
              </div>
              <Badge variant="secondary" className={getStatusColor()}>
                {getStatusText()}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!timerState.isRunning && !timerState.isPaused && (
              <Button
                size="sm"
                onClick={onStart}
                className="bg-green-600 hover:bg-green-700"
              >
                <PlayIcon className="h-4 w-4" />
                Start
              </Button>
            )}

            {timerState.isRunning && (
              <Button
                size="sm"
                onClick={onPause}
                variant="outline"
                className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              >
                <PauseIcon className="h-4 w-4" />
                Pause
              </Button>
            )}

            {timerState.isPaused && (
              <Button
                size="sm"
                onClick={onStart}
                className="bg-green-600 hover:bg-green-700"
              >
                <PlayIcon className="h-4 w-4" />
                Resume
              </Button>
            )}

            {(timerState.isRunning || timerState.isPaused) && (
              <Button size="sm" onClick={onStop} variant="destructive">
                <SquareIcon className="h-4 w-4" />
                Stop
              </Button>
            )}

            {timerState.elapsedTime > 0 && (
              <Button size="sm" onClick={onReset} variant="outline">
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Current Session Info */}
        {timerState.currentSession && (
          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <div className="text-sm text-blue-700">
              <strong>Current Session:</strong>{" "}
              {timerState.currentSession.description || "Untitled"}
            </div>
            {timerState.currentSession.project && (
              <div className="text-xs text-blue-600 mt-1">
                Project: {timerState.currentSession.project}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}



