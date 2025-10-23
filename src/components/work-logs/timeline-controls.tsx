"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarIcon,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCcwIcon,
} from "lucide-react";
import { TimelineViewMode } from "@/types";

interface TimelineControlsProps {
  viewMode: TimelineViewMode;
  onViewModeChange: (mode: TimelineViewMode) => void;
  onDateChange: (date: string) => void;
  onZoomChange: (zoom: number) => void;
  onReset: () => void;
  totalHours: number;
  totalEarnings: number;
  hourlyRate: number;
}

export function TimelineControls({
  viewMode,
  onViewModeChange,
  onDateChange,
  onZoomChange,
  onReset,
  totalHours,
  totalEarnings,
  hourlyRate,
}: TimelineControlsProps) {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDateInputValue = (date: string): string => {
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Date Picker */}
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              <input
                type="date"
                value={getDateInputValue(viewMode.date)}
                onChange={(e) => onDateChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* View Mode Tabs */}
            <Tabs
              value={viewMode.type}
              onValueChange={(value) =>
                onViewModeChange({
                  ...viewMode,
                  type: value as "daily" | "weekly" | "monthly",
                })
              }
            >
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Zoom Controls - Only show for daily view */}
            {viewMode.type === "daily" && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onZoomChange(Math.max(0.5, viewMode.zoom - 0.25))
                  }
                  disabled={viewMode.zoom <= 0.5}
                >
                  <ZoomOutIcon className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                  {Math.round(viewMode.zoom * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onZoomChange(Math.min(3, viewMode.zoom + 0.25))
                  }
                  disabled={viewMode.zoom >= 3}
                >
                  <ZoomInIcon className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Reset Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              title="Reset zoom and view settings"
            >
              <RotateCcwIcon className="h-4 w-4" />
              Reset View
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {totalHours.toFixed(1)}h
              </div>
              <div className="text-sm text-gray-500">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalEarnings)}
              </div>
              <div className="text-sm text-gray-500">Total Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(hourlyRate)}
              </div>
              <div className="text-sm text-gray-500">Hourly Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
