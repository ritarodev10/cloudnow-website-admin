import { WorkSession, TimelineBlock, Invoice, InvoiceItem } from "@/types";

// Time conversion utilities
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}m`;
  }
};

// Work session calculations
export const calculateSessionDuration = (
  startTime: string,
  endTime: string
): number => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return end - start;
};

export const calculateOverlap = (sessions: WorkSession[]): WorkSession[] => {
  if (sessions.length <= 1) return sessions;

  // Sort sessions by start time
  const sortedSessions = [...sessions].sort(
    (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  const mergedSessions: WorkSession[] = [];
  let currentSession = { ...sortedSessions[0] };

  for (let i = 1; i < sortedSessions.length; i++) {
    const nextSession = sortedSessions[i];
    const currentEnd = timeToMinutes(currentSession.endTime);
    const nextStart = timeToMinutes(nextSession.startTime);

    // If sessions overlap or are adjacent (within 15 minutes)
    if (nextStart <= currentEnd + 15) {
      // Merge sessions - extend end time if needed
      if (timeToMinutes(nextSession.endTime) > currentEnd) {
        currentSession.endTime = nextSession.endTime;
      }
      // Combine descriptions
      currentSession.description += `; ${nextSession.description}`;
    } else {
      // No overlap, add current session and start new one
      mergedSessions.push(currentSession);
      currentSession = { ...nextSession };
    }
  }

  mergedSessions.push(currentSession);
  return mergedSessions;
};

export const calculateTotalHours = (sessions: WorkSession[]): number => {
  const mergedSessions = calculateOverlap(sessions);
  return mergedSessions.reduce((total, session) => {
    return (
      total + calculateSessionDuration(session.startTime, session.endTime) / 60
    );
  }, 0);
};

export const calculateEarnings = (
  sessions: WorkSession[],
  hourlyRate: number
): number => {
  const totalHours = calculateTotalHours(sessions);
  return totalHours * hourlyRate;
};

// Timeline utilities
export const formatTimelineData = (
  sessions: WorkSession[]
): TimelineBlock[] => {
  return sessions.map((session) => ({
    id: session.id,
    startTime: timeToMinutes(session.startTime),
    endTime: timeToMinutes(session.endTime),
    duration: calculateSessionDuration(session.startTime, session.endTime),
    color: getProjectColor(session.project || "default"),
    description: session.description,
    project: session.project,
    category: session.category,
    isOverlapping: false, // Will be calculated separately
  }));
};

export const getProjectColor = (project: string): string => {
  const colors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#06B6D4", // Cyan
    "#84CC16", // Lime
    "#F97316", // Orange
  ];

  const hash = project.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  return colors[Math.abs(hash) % colors.length];
};

export const validateTimeBlock = (
  startTime: string,
  endTime: string
): boolean => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  return start < end && start >= 0 && end <= 1440; // Within 24 hours
};

// Invoice utilities
export const generateInvoiceNumber = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `INV-${year}-${randomNum}`;
};

export const calculateInvoiceTotal = (
  items: InvoiceItem[],
  taxRate: number = 0
): number => {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * taxRate;
  return subtotal + tax;
};

export const generateInvoice = (
  staffId: string,
  staffName: string,
  period: { startDate: string; endDate: string },
  totalHours: number,
  hourlyRate: number,
  taxRate: number = 0
): Invoice => {
  const invoiceNumber = generateInvoiceNumber();
  const subtotal = totalHours * hourlyRate;
  const tax = taxRate > 0 ? subtotal * taxRate : 0;
  const total = subtotal + tax;

  const items: InvoiceItem[] = [
    {
      id: `item-${Date.now()}`,
      description: `Work hours - ${period.startDate} to ${period.endDate}`,
      hours: totalHours,
      rate: hourlyRate,
      amount: subtotal,
    },
  ];

  return {
    id: `inv-${Date.now()}`,
    staffId,
    staffName,
    invoiceNumber,
    period,
    items,
    subtotal,
    tax: taxRate > 0 ? tax : undefined,
    total,
    status: "unpaid",
    createdAt: new Date().toISOString(),
  };
};

// Formatting utilities
export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Snapping utilities for timeline
export const snapToGrid = (minutes: number, gridSize: number = 15): number => {
  return Math.round(minutes / gridSize) * gridSize;
};

export const snapTimeToGrid = (time: string, gridSize: number = 15): string => {
  const minutes = timeToMinutes(time);
  const snappedMinutes = snapToGrid(minutes, gridSize);
  return minutesToTime(snappedMinutes);
};

// Timer utilities
export const formatElapsedTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  } else {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
};

export const getElapsedTimeInMinutes = (milliseconds: number): number => {
  return Math.floor(milliseconds / (1000 * 60));
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateHourlyRate = (rate: number): boolean => {
  return rate > 0 && rate <= 1000; // Reasonable range
};

export const validateWorkSession = (
  session: Partial<WorkSession>
): string[] => {
  const errors: string[] = [];

  if (!session.startTime || !session.endTime) {
    errors.push("Start time and end time are required");
  } else if (!validateTimeBlock(session.startTime, session.endTime)) {
    errors.push("Invalid time range");
  }

  if (!session.description || session.description.trim().length === 0) {
    errors.push("Description is required");
  }

  return errors;
};

// Date utilities
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

export const getWeekEnd = (date: Date): Date => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
};

export const getMonthStart = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

export const getMonthEnd = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    return `${start.getDate()}-${end.getDate()} ${start.toLocaleDateString(
      "en-US",
      { month: "short", year: "numeric" }
    )}`;
  } else {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  }
};



