"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeRange } from "@/types/analytics";

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

const timeRangeLabels: Record<TimeRange, string> = {
  "24h": "Last 24 hours",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  custom: "Custom range",
};

export function TimeRangeSelector({
  value,
  onChange,
  onPrevious,
  onNext,
}: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      {onPrevious && (
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevious}
          className="h-9 w-9"
        >
          <i className="ri-arrow-left-line" />
        </Button>
      )}
      
      <Select value={value} onValueChange={(val) => onChange(val as TimeRange)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range">
            {timeRangeLabels[value]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="24h">{timeRangeLabels["24h"]}</SelectItem>
          <SelectItem value="7d">{timeRangeLabels["7d"]}</SelectItem>
          <SelectItem value="30d">{timeRangeLabels["30d"]}</SelectItem>
          <SelectItem value="custom">{timeRangeLabels["custom"]}</SelectItem>
        </SelectContent>
      </Select>

      {onNext && (
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          className="h-9 w-9"
        >
          <i className="ri-arrow-right-line" />
        </Button>
      )}
    </div>
  );
}

