"use client";

import React, { useRef, useState, useCallback } from "react";
import { TimelineBlock } from "@/types";
import { minutesToTime, snapToGrid } from "@/lib/work-log-utils";

interface TimelineCanvasProps {
  blocks: TimelineBlock[];
  onBlockCreate?: (startTime: number, endTime: number) => void;
  onBlockUpdate?: (blockId: string, startTime: number, endTime: number) => void;
  onBlockDelete?: (blockId: string) => void;
  onBlockClick?: (blockId: string) => void;
  viewMode: "daily" | "weekly";
  selectedDate: string;
  zoom: number;
  isReadOnly?: boolean;
}

const TIMELINE_HEIGHT = 80;
const BLOCK_HEIGHT = 40;
const HOUR_WIDTH = 60; // Base width for 1 hour
const GRID_SIZE = 15; // 15-minute intervals

export function TimelineCanvas({
  blocks,
  onBlockCreate,
  onBlockUpdate,
  onBlockDelete,
  onBlockClick,
  viewMode,
  selectedDate,
  zoom,
  isReadOnly = false,
}: TimelineCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{
    x: number;
    time: number;
  } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ x: number; time: number } | null>(
    null
  );
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const hourWidth = HOUR_WIDTH * zoom;
  const timelineWidth =
    viewMode === "daily" ? hourWidth * 24 : hourWidth * 24 * 7;

  // Convert pixel position to time
  const pixelToTime = useCallback(
    (x: number): number => {
      const snappedMinutes = snapToGrid((x / hourWidth) * 60, GRID_SIZE);
      return Math.max(0, Math.min(1440, snappedMinutes)); // Clamp to 0-1440 minutes
    },
    [hourWidth]
  );

  // Convert time to pixel position
  const timeToPixel = useCallback(
    (minutes: number): number => {
      return (minutes / 60) * hourWidth;
    },
    [hourWidth]
  );

  // Handle mouse down for creating new blocks
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isReadOnly) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const time = pixelToTime(x);

    setIsDragging(true);
    setDragStart({ x, time });
    setDragEnd({ x, time });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const time = pixelToTime(x);

    setDragEnd({ x, time });
  };

  // Handle mouse up to finish dragging
  const handleMouseUp = () => {
    if (!isDragging || !dragStart || !dragEnd) return;

    const startTime = Math.min(dragStart.time, dragEnd.time);
    const endTime = Math.max(dragStart.time, dragEnd.time);

    // Only create block if duration is at least 15 minutes
    if (endTime - startTime >= GRID_SIZE && onBlockCreate) {
      onBlockCreate(startTime, endTime);
    }

    setIsDragging(false);
    setDragStart(null);
    setDragEnd(null);
  };

  // Render hour markers
  const renderHourMarkers = () => {
    const markers = [];
    const hourCount = viewMode === "daily" ? 24 : 24 * 7;

    for (let i = 0; i <= hourCount; i++) {
      const x = timeToPixel(i * 60);
      const hour = i % 24;
      const day = Math.floor(i / 24);

      markers.push(
        <div
          key={i}
          className="absolute top-0 h-full border-l border-gray-200"
          style={{ left: x }}
        >
          <div className="absolute -top-6 left-1 text-xs text-gray-500 font-medium">
            {viewMode === "daily" ? `${hour}:00` : `${day}d ${hour}:00`}
          </div>
        </div>
      );
    }

    return markers;
  };

  // Render grid lines
  const renderGridLines = () => {
    const lines = [];
    const hourCount = viewMode === "daily" ? 24 : 24 * 7;

    for (let hour = 0; hour < hourCount; hour++) {
      for (let quarter = 1; quarter < 4; quarter++) {
        const x = timeToPixel(hour * 60 + quarter * 15);
        lines.push(
          <div
            key={`${hour}-${quarter}`}
            className="absolute top-0 h-full border-l border-gray-100"
            style={{ left: x }}
          />
        );
      }
    }

    return lines;
  };

  // Render timeline blocks
  const renderBlocks = () => {
    return blocks.map((block) => {
      const startX = timeToPixel(block.startTime);
      const endX = timeToPixel(block.endTime);
      const width = endX - startX;

      return (
        <div
          key={block.id}
          className={`absolute rounded-md cursor-pointer transition-all duration-200 hover:shadow-md ${
            hoveredBlock === block.id ? "shadow-lg" : ""
          } ${block.isOverlapping ? "opacity-75" : ""}`}
          style={{
            left: startX,
            top: 20,
            width: width,
            height: BLOCK_HEIGHT,
            backgroundColor: block.color,
          }}
          onMouseEnter={() => setHoveredBlock(block.id)}
          onMouseLeave={() => setHoveredBlock(null)}
          onClick={() => onBlockClick?.(block.id)}
          title={`${minutesToTime(block.startTime)} - ${minutesToTime(
            block.endTime
          )} (${Math.round(block.duration)}m): ${block.description}`}
        >
          <div className="p-2 text-white text-sm font-medium truncate">
            {block.description}
          </div>
          <div className="absolute bottom-1 right-2 text-xs text-white/80">
            {Math.round(block.duration)}m
          </div>
        </div>
      );
    });
  };

  // Render drag preview
  const renderDragPreview = () => {
    if (!isDragging || !dragStart || !dragEnd) return null;

    const startTime = Math.min(dragStart.time, dragEnd.time);
    const endTime = Math.max(dragStart.time, dragEnd.time);
    const startX = timeToPixel(startTime);
    const endX = timeToPixel(endTime);
    const width = endX - startX;

    return (
      <div
        className="absolute rounded-md border-2 border-dashed border-blue-400 bg-blue-100/50"
        style={{
          left: startX,
          top: 20,
          width: width,
          height: BLOCK_HEIGHT,
        }}
      >
        <div className="p-2 text-blue-600 text-sm font-medium">
          {minutesToTime(startTime)} - {minutesToTime(endTime)}
        </div>
      </div>
    );
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Timeline Header */}
      <div className="h-8 bg-gray-50 border-b border-gray-200 flex items-center px-4">
        <span className="text-sm font-medium text-gray-700">
          {viewMode === "daily" ? "Daily Timeline" : "Weekly Timeline"} -{" "}
          {selectedDate}
        </span>
      </div>

      {/* Timeline Canvas */}
      <div
        ref={canvasRef}
        className="relative cursor-crosshair"
        style={{ height: TIMELINE_HEIGHT, width: timelineWidth }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Grid Lines */}
        {renderGridLines()}

        {/* Hour Markers */}
        {renderHourMarkers()}

        {/* Timeline Blocks */}
        {renderBlocks()}

        {/* Drag Preview */}
        {renderDragPreview()}
      </div>

      {/* Timeline Footer */}
      <div className="h-8 bg-gray-50 border-t border-gray-200 flex items-center justify-between px-4">
        <div className="text-xs text-gray-500">
          Total: {blocks.reduce((sum, block) => sum + block.duration, 0)}{" "}
          minutes
        </div>
        <div className="text-xs text-gray-500">
          {blocks.length} session{blocks.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}



