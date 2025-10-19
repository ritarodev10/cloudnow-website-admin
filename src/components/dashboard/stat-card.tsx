"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  iconColor?: string;
  change?: {
    value: string;
    trend: "up" | "down";
  };
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "primary",
  change,
}: StatCardProps) {
  return (
    <Card className="bg-card text-card-foreground flex flex-col rounded-xl border py-6 shadow-sm from-primary/20 to-card justify-between gap-3 bg-radial-[at_150%_90%] to-60% h-full transition-all duration-300 ease-in-out">
      <CardContent className="px-6 flex flex-col gap-3 h-full">
        {/* Icon and Value Row */}
        <div className="flex items-center gap-3">
          <span className="relative flex shrink-0 overflow-hidden rounded-full size-8">
            <span
              className={`flex items-center justify-center rounded-full size-8 shrink-0 [&>svg]:size-4 transition-all duration-300 ease-in-out ${
                iconColor === "orange"
                  ? "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                  : iconColor === "teal"
                  ? "bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400"
                  : iconColor === "blue"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : iconColor === "yellow"
                  ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                  : iconColor === "green"
                  ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                  : iconColor === "purple"
                  ? "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                  : iconColor === "pink"
                  ? "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400"
                  : "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
              }`}
            >
              {Icon && (
                <Icon className="size-4 transition-colors duration-300 ease-in-out" />
              )}
            </span>
          </span>
          <span className="text-2xl font-semibold transition-colors duration-300 ease-in-out">
            {value}
          </span>
        </div>

        {/* Title */}
        <div className="text-sm font-medium transition-colors duration-300 ease-in-out">
          {title}
        </div>

        {/* Change Indicator */}
        {change && (
          <div className="flex items-center gap-1 flex-wrap">
            <Badge className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all duration-300 ease-in-out focus-visible:ring-[3px] [&>svg]:pointer-events-none [&>svg]:size-3 [a&]:hover:bg-primary/90 border-transparent bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary rounded-full">
              {change.trend === "up" ? (
                <TrendingUp className="size-3 transition-colors duration-300 ease-in-out" />
              ) : (
                <TrendingDown className="size-3 transition-colors duration-300 ease-in-out" />
              )}
              {change.value}
            </Badge>
            <span className="text-xs text-muted-foreground whitespace-nowrap transition-colors duration-300 ease-in-out">
              than last week
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
