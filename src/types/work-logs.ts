export interface WorkSession {
  id: string;
  staffId: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  description: string;
  project?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineBlock {
  id: string;
  startTime: number; // Minutes from midnight (0-1440)
  endTime: number; // Minutes from midnight (0-1440)
  duration: number; // Minutes
  color: string;
  description: string;
  project?: string;
  category?: string;
  isOverlapping?: boolean;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: number | null;
  elapsedTime: number;
  currentSession: Partial<WorkSession> | null;
}

export interface WorkLog {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  sessions: WorkSession[];
  totalHours: number;
  totalEarnings: number;
  hourlyRate: number;
}

export interface WorkLogSummary {
  totalHours: number;
  totalEarnings: number;
  sessionCount: number;
  averageSessionDuration: number;
}

export interface TimelineViewMode {
  type: "daily" | "weekly" | "monthly";
  date: string;
  zoom: number; // 1 = normal, 2 = zoomed in, 0.5 = zoomed out
}

export interface MonthlyDaySummary {
  date: string;
  totalHours: number;
  sessionCount: number;
}
