"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { visitorChartData } from "@/data/dashboard-data";

export function VisitorChart() {
  const [timeRange, setTimeRange] = useState<"3months" | "30days" | "7days">(
    "3months"
  );

  const currentData = visitorChartData[timeRange];

  return (
    <Card className="bg-card text-card-foreground rounded-xl border shadow-sm h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              {currentData.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {currentData.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={timeRange === "3months" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("3months")}
              className="h-7 px-3 text-xs"
            >
              Last 3 months
            </Button>
            <Button
              variant={timeRange === "30days" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("30days")}
              className="h-7 px-3 text-xs"
            >
              Last 30 days
            </Button>
            <Button
              variant={timeRange === "7days" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("7days")}
              className="h-7 px-3 text-xs"
            >
              Last 7 days
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentData.data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--muted)"
                opacity={0.2}
              />
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                fontSize={10}
                fontWeight={500}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                labelStyle={{
                  color: "var(--foreground)",
                  fontWeight: "500",
                }}
                formatter={(value: number, name: string) => [
                  value,
                  name === "desktop" ? "Desktop" : "Mobile",
                ]}
              />
              <Area
                type="monotone"
                dataKey="mobile"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="desktop"
                stackId="2"
                stroke="#2563EB"
                fill="#2563EB"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-sm text-muted-foreground">Desktop</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-sm text-muted-foreground">Mobile</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
