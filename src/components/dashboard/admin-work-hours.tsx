"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AdminIllustration } from "@/components/icons/admin-illustration";
import { adminWorkHoursData } from "@/data/dashboard-data";

export function AdminWorkHours() {
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");

  const currentData = adminWorkHoursData[timeframe];

  return (
    <Card className="bg-card text-card-foreground flex flex-col rounded-xl border py-6 shadow-sm from-primary/20 to-card justify-between gap-3 bg-radial-[at_150%_90%] to-60% relative max-xl:col-span-full h-full overflow-hidden">
      <CardContent className="px-6 flex flex-col gap-4 h-full">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="font-medium">Work Hours</span>
        </div>

        {/* Value and Change */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-4xl font-semibold">{currentData.value}</span>
          <span className="text-sm text-green-600 dark:text-green-400">
            {currentData.change}
          </span>
        </div>

        {/* Switch */}
        <div className="flex items-center gap-1">
          <Button
            variant={timeframe === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("week")}
            className="h-6 px-2 text-xs"
          >
            Week
          </Button>
          <Button
            variant={timeframe === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeframe("month")}
            className="h-6 px-2 text-xs"
          >
            Month
          </Button>
        </div>

        {/* Illustration */}
        <div className="absolute right-0 bottom-4 scale-125">
          <AdminIllustration />
        </div>
      </CardContent>
    </Card>
  );
}
