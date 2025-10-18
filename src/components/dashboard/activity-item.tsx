"use client";

import { LucideIcon } from "lucide-react";

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  time: string;
}

export function ActivityItem({ icon: Icon, title, time }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="rounded-full bg-primary/10 dark:bg-primary/20 p-2">
        <Icon className="h-4 w-4 bg-transparent text-primary" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
