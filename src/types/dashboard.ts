import { LucideIcon } from "lucide-react";

// Dashboard Types
export interface DashboardStat {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  change?: {
    value: string;
    trend: "up" | "down";
  };
}

export interface ActivityItem {
  icon: LucideIcon;
  title: string;
  time: string;
}

export interface SubmissionItem {
  name: string;
  type: string;
  time: string;
}

export interface Visitor {
  ip: string;
  location: string;
  page: string;
  duration: string;
  device: string;
  time: string;
}

export interface TrafficSource {
  name: string;
  percentage: number;
  change: string;
}
