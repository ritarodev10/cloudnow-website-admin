import {
  WorkSession,
  TimelineBlock,
  WorkLog,
  WorkLogSummary,
  TimerState,
  MonthlyDaySummary,
} from "@/types";

// Sample work sessions data
export const sampleWorkSessions: WorkSession[] = [
  // October 2025 sample data - Michael Barreto (CEO)
  {
    id: "oct-ceo-1",
    staffId: "staff-1",
    date: "2025-10-01",
    startTime: "08:00",
    endTime: "17:00",
    description: "Executive strategy planning and team meetings",
    project: "Strategic Planning",
    category: "Management",
    createdAt: "2025-10-01T08:00:00Z",
    updatedAt: "2025-10-01T17:00:00Z",
  },
  {
    id: "oct-ceo-2",
    staffId: "staff-1",
    date: "2025-10-02",
    startTime: "09:00",
    endTime: "16:00",
    description: "Client relationship management and business development",
    project: "Business Development",
    category: "Management",
    createdAt: "2025-10-02T09:00:00Z",
    updatedAt: "2025-10-02T16:00:00Z",
  },
  {
    id: "oct-ceo-3",
    staffId: "staff-1",
    date: "2025-10-03",
    startTime: "10:00",
    endTime: "15:00",
    description: "Financial review and budget planning",
    project: "Financial Planning",
    category: "Management",
    createdAt: "2025-10-03T10:00:00Z",
    updatedAt: "2025-10-03T15:00:00Z",
  },

  // Everton de Almeida (Director of Cybersecurity)
  {
    id: "oct-cyber-1",
    staffId: "staff-2",
    date: "2025-10-01",
    startTime: "22:00",
    endTime: "07:00",
    description: "Security monitoring and threat analysis",
    project: "Security Operations Center",
    category: "Cybersecurity",
    createdAt: "2025-10-01T22:00:00Z",
    updatedAt: "2025-10-02T07:00:00Z",
  },
  {
    id: "oct-cyber-2",
    staffId: "staff-2",
    date: "2025-10-02",
    startTime: "22:00",
    endTime: "07:00",
    description: "Incident response and security policy review",
    project: "Incident Response",
    category: "Cybersecurity",
    createdAt: "2025-10-02T22:00:00Z",
    updatedAt: "2025-10-03T07:00:00Z",
  },
  {
    id: "oct-cyber-3",
    staffId: "staff-2",
    date: "2025-10-03",
    startTime: "22:00",
    endTime: "07:00",
    description: "Security audit and compliance review",
    project: "Compliance Audit",
    category: "Cybersecurity",
    createdAt: "2025-10-03T22:00:00Z",
    updatedAt: "2025-10-04T07:00:00Z",
  },

  // Muhammad Khuluqil Karim (Cybersecurity Operations Analyst)
  {
    id: "oct-analyst-1",
    staffId: "staff-3",
    date: "2025-10-01",
    startTime: "22:00",
    endTime: "07:00",
    description: "Security log analysis and threat hunting",
    project: "Threat Intelligence",
    category: "Cybersecurity",
    createdAt: "2025-10-01T22:00:00Z",
    updatedAt: "2025-10-02T07:00:00Z",
  },
  {
    id: "oct-analyst-2",
    staffId: "staff-3",
    date: "2025-10-02",
    startTime: "22:00",
    endTime: "07:00",
    description: "Vulnerability assessment and penetration testing",
    project: "Security Testing",
    category: "Cybersecurity",
    createdAt: "2025-10-02T22:00:00Z",
    updatedAt: "2025-10-03T07:00:00Z",
  },
  {
    id: "oct-analyst-3",
    staffId: "staff-3",
    date: "2025-10-03",
    startTime: "22:00",
    endTime: "07:00",
    description: "Security tool configuration and monitoring setup",
    project: "Security Infrastructure",
    category: "Cybersecurity",
    createdAt: "2025-10-03T22:00:00Z",
    updatedAt: "2025-10-04T07:00:00Z",
  },

  // Raihan Habibi (IT Systems Administrator)
  {
    id: "oct-admin-1",
    staffId: "staff-4",
    date: "2025-10-01",
    startTime: "08:00",
    endTime: "16:00",
    description: "Server maintenance and system updates",
    project: "System Administration",
    category: "Infrastructure",
    createdAt: "2025-10-01T08:00:00Z",
    updatedAt: "2025-10-01T16:00:00Z",
  },
  {
    id: "oct-admin-2",
    staffId: "staff-4",
    date: "2025-10-02",
    startTime: "08:00",
    endTime: "16:00",
    description: "Cloud infrastructure management and optimization",
    project: "Cloud Management",
    category: "Infrastructure",
    createdAt: "2025-10-02T08:00:00Z",
    updatedAt: "2025-10-02T16:00:00Z",
  },
  {
    id: "oct-admin-3",
    staffId: "staff-4",
    date: "2025-10-03",
    startTime: "08:00",
    endTime: "16:00",
    description: "Backup systems and disaster recovery testing",
    project: "Disaster Recovery",
    category: "Infrastructure",
    createdAt: "2025-10-03T08:00:00Z",
    updatedAt: "2025-10-03T16:00:00Z",
  },

  // Riza Taufiqur Rohman (Web Developer)
  {
    id: "oct-dev-1",
    staffId: "staff-5",
    date: "2025-10-01",
    startTime: "22:00",
    endTime: "07:00",
    description: "Frontend development for client portal",
    project: "Client Portal",
    category: "Development",
    createdAt: "2025-10-01T22:00:00Z",
    updatedAt: "2025-10-02T07:00:00Z",
  },
  {
    id: "oct-dev-2",
    staffId: "staff-5",
    date: "2025-10-02",
    startTime: "22:00",
    endTime: "07:00",
    description: "API integration and backend development",
    project: "API Development",
    category: "Development",
    createdAt: "2025-10-02T22:00:00Z",
    updatedAt: "2025-10-03T07:00:00Z",
  },
  {
    id: "oct-dev-3",
    staffId: "staff-5",
    date: "2025-10-03",
    startTime: "22:00",
    endTime: "07:00",
    description: "Code review and testing automation",
    project: "Quality Assurance",
    category: "Development",
    createdAt: "2025-10-03T22:00:00Z",
    updatedAt: "2025-10-04T07:00:00Z",
  },

  // Additional sessions for October 2025
  {
    id: "oct-ceo-4",
    staffId: "staff-1",
    date: "2025-10-08",
    startTime: "08:00",
    endTime: "17:00",
    description: "Team performance review and goal setting",
    project: "Performance Management",
    category: "Management",
    createdAt: "2025-10-08T08:00:00Z",
    updatedAt: "2025-10-08T17:00:00Z",
  },
  {
    id: "oct-cyber-4",
    staffId: "staff-2",
    date: "2025-10-08",
    startTime: "22:00",
    endTime: "07:00",
    description: "Security training and team development",
    project: "Team Development",
    category: "Cybersecurity",
    createdAt: "2025-10-08T22:00:00Z",
    updatedAt: "2025-10-09T07:00:00Z",
  },
  {
    id: "oct-analyst-4",
    staffId: "staff-3",
    date: "2025-10-08",
    startTime: "22:00",
    endTime: "07:00",
    description: "Security documentation and reporting",
    project: "Documentation",
    category: "Cybersecurity",
    createdAt: "2025-10-08T22:00:00Z",
    updatedAt: "2025-10-09T07:00:00Z",
  },
  {
    id: "oct-admin-4",
    staffId: "staff-4",
    date: "2025-10-08",
    startTime: "08:00",
    endTime: "16:00",
    description: "Network monitoring and troubleshooting",
    project: "Network Management",
    category: "Infrastructure",
    createdAt: "2025-10-08T08:00:00Z",
    updatedAt: "2025-10-08T16:00:00Z",
  },
  {
    id: "oct-dev-4",
    staffId: "staff-5",
    date: "2025-10-08",
    startTime: "22:00",
    endTime: "07:00",
    description: "UI/UX improvements and responsive design",
    project: "UI/UX Enhancement",
    category: "Development",
    createdAt: "2025-10-08T22:00:00Z",
    updatedAt: "2025-10-09T07:00:00Z",
  },

  // More sessions for the rest of October
  {
    id: "oct-ceo-5",
    staffId: "staff-1",
    date: "2025-10-15",
    startTime: "09:00",
    endTime: "16:00",
    description: "Client meetings and project planning",
    project: "Client Relations",
    category: "Management",
    createdAt: "2025-10-15T09:00:00Z",
    updatedAt: "2025-10-15T16:00:00Z",
  },
  {
    id: "oct-cyber-5",
    staffId: "staff-2",
    date: "2025-10-15",
    startTime: "22:00",
    endTime: "07:00",
    description: "Security architecture review and planning",
    project: "Security Architecture",
    category: "Cybersecurity",
    createdAt: "2025-10-15T22:00:00Z",
    updatedAt: "2025-10-16T07:00:00Z",
  },
  {
    id: "oct-analyst-5",
    staffId: "staff-3",
    date: "2025-10-15",
    startTime: "22:00",
    endTime: "07:00",
    description: "Malware analysis and reverse engineering",
    project: "Malware Analysis",
    category: "Cybersecurity",
    createdAt: "2025-10-15T22:00:00Z",
    updatedAt: "2025-10-16T07:00:00Z",
  },
  {
    id: "oct-admin-5",
    staffId: "staff-4",
    date: "2025-10-15",
    startTime: "08:00",
    endTime: "16:00",
    description: "Database optimization and maintenance",
    project: "Database Management",
    category: "Infrastructure",
    createdAt: "2025-10-15T08:00:00Z",
    updatedAt: "2025-10-15T16:00:00Z",
  },
  {
    id: "oct-dev-5",
    staffId: "staff-5",
    date: "2025-10-15",
    startTime: "22:00",
    endTime: "07:00",
    description: "Mobile app development and testing",
    project: "Mobile Development",
    category: "Development",
    createdAt: "2025-10-15T22:00:00Z",
    updatedAt: "2025-10-16T07:00:00Z",
  },

  // End of October sessions
  {
    id: "oct-ceo-6",
    staffId: "staff-1",
    date: "2025-10-31",
    startTime: "08:00",
    endTime: "17:00",
    description: "Monthly business review and planning",
    project: "Monthly Review",
    category: "Management",
    createdAt: "2025-10-31T08:00:00Z",
    updatedAt: "2025-10-31T17:00:00Z",
  },
  {
    id: "oct-cyber-6",
    staffId: "staff-2",
    date: "2025-10-31",
    startTime: "22:00",
    endTime: "07:00",
    description: "Security metrics analysis and reporting",
    project: "Security Reporting",
    category: "Cybersecurity",
    createdAt: "2025-10-31T22:00:00Z",
    updatedAt: "2025-11-01T07:00:00Z",
  },
  {
    id: "oct-analyst-6",
    staffId: "staff-3",
    date: "2025-10-31",
    startTime: "22:00",
    endTime: "07:00",
    description: "Security tool evaluation and implementation",
    project: "Tool Implementation",
    category: "Cybersecurity",
    createdAt: "2025-10-31T22:00:00Z",
    updatedAt: "2025-11-01T07:00:00Z",
  },
  {
    id: "oct-admin-6",
    staffId: "staff-4",
    date: "2025-10-31",
    startTime: "08:00",
    endTime: "16:00",
    description: "System performance monitoring and optimization",
    project: "Performance Optimization",
    category: "Infrastructure",
    createdAt: "2025-10-31T08:00:00Z",
    updatedAt: "2025-10-31T16:00:00Z",
  },
  {
    id: "oct-dev-6",
    staffId: "staff-5",
    date: "2025-10-31",
    startTime: "22:00",
    endTime: "07:00",
    description: "Code deployment and production monitoring",
    project: "Deployment",
    category: "Development",
    createdAt: "2025-10-31T22:00:00Z",
    updatedAt: "2025-11-01T07:00:00Z",
  },

  // Original 2024 data for reference
  {
    id: "1",
    staffId: "staff-1",
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "12:00",
    description: "Executive strategy planning",
    project: "Strategic Planning",
    category: "Management",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T12:00:00Z",
  },
  {
    id: "2",
    staffId: "staff-1",
    date: "2024-01-15",
    startTime: "13:00",
    endTime: "17:00",
    description: "Client relationship management",
    project: "Client Relations",
    category: "Management",
    createdAt: "2024-01-15T13:00:00Z",
    updatedAt: "2024-01-15T17:00:00Z",
  },
  {
    id: "3",
    staffId: "staff-2",
    date: "2024-01-15",
    startTime: "22:00",
    endTime: "07:00",
    description: "Security monitoring and analysis",
    project: "Security Operations",
    category: "Cybersecurity",
    createdAt: "2024-01-15T22:00:00Z",
    updatedAt: "2024-01-16T07:00:00Z",
  },
  {
    id: "4",
    staffId: "staff-3",
    date: "2024-01-15",
    startTime: "22:00",
    endTime: "07:00",
    description: "Threat hunting and vulnerability assessment",
    project: "Threat Intelligence",
    category: "Cybersecurity",
    createdAt: "2024-01-15T22:00:00Z",
    updatedAt: "2024-01-16T07:00:00Z",
  },
];

// Sample work logs (aggregated by staff and date)
export const sampleWorkLogs: WorkLog[] = [
  {
    id: "log-1",
    staffId: "staff-1",
    staffName: "Michael Barreto",
    date: "2024-01-15",
    sessions: sampleWorkSessions.filter(
      (s) => s.staffId === "staff-1" && s.date === "2024-01-15"
    ),
    totalHours: 7,
    totalEarnings: 840,
    hourlyRate: 120,
  },
  {
    id: "log-2",
    staffId: "staff-2",
    staffName: "Everton de Almeida",
    date: "2024-01-15",
    sessions: sampleWorkSessions.filter(
      (s) => s.staffId === "staff-2" && s.date === "2024-01-15"
    ),
    totalHours: 9,
    totalEarnings: 765,
    hourlyRate: 85,
  },
  {
    id: "log-3",
    staffId: "staff-3",
    staffName: "Muhammad Khuluqil Karim",
    date: "2024-01-15",
    sessions: sampleWorkSessions.filter(
      (s) => s.staffId === "staff-3" && s.date === "2024-01-15"
    ),
    totalHours: 9,
    totalEarnings: 585,
    hourlyRate: 65,
  },
];

// Utility functions for timeline calculations
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

export const generateWorkLogSummary = (workLogs: WorkLog[]): WorkLogSummary => {
  const totalHours = workLogs.reduce((sum, log) => sum + log.totalHours, 0);
  const totalEarnings = workLogs.reduce(
    (sum, log) => sum + log.totalEarnings,
    0
  );
  const sessionCount = workLogs.reduce(
    (sum, log) => sum + log.sessions.length,
    0
  );
  const averageSessionDuration =
    sessionCount > 0 ? totalHours / sessionCount : 0;

  return {
    totalHours,
    totalEarnings,
    sessionCount,
    averageSessionDuration,
  };
};

// Timer state management
export const getInitialTimerState = (): TimerState => ({
  isRunning: false,
  isPaused: false,
  startTime: null,
  elapsedTime: 0,
  currentSession: null,
});

export const loadTimerState = (): TimerState => {
  if (typeof window === "undefined") return getInitialTimerState();

  try {
    const saved = localStorage.getItem("work-log-timer");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        startTime: parsed.isRunning ? Date.now() : null, // Reset start time on reload
      };
    }
  } catch (error) {
    console.error("Failed to load timer state:", error);
  }

  return getInitialTimerState();
};

export const saveTimerState = (state: TimerState): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("work-log-timer", JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save timer state:", error);
  }
};

// Weekly data loading
export const getWeekSessions = (
  startDate: string,
  staffId: string
): WorkSession[] => {
  const start = new Date(startDate);
  const sessions: WorkSession[] = [];

  // Get sessions for 7 days starting from startDate
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    const dateString = currentDate.toISOString().split("T")[0];

    const daySessions = sampleWorkSessions.filter(
      (session) => session.staffId === staffId && session.date === dateString
    );

    sessions.push(...daySessions);
  }

  // Return sorted by date and time
  return sessions.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.startTime.localeCompare(b.startTime);
  });
};

// Monthly summary calculation
export const getMonthSummary = (
  month: string,
  staffId: string
): MonthlyDaySummary[] => {
  const monthDate = new Date(month + "-01");
  const year = monthDate.getFullYear();
  const monthIndex = monthDate.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const summary: MonthlyDaySummary[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = `${year}-${String(monthIndex + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    const daySessions = sampleWorkSessions.filter(
      (session) => session.staffId === staffId && session.date === dateString
    );

    const totalHours = daySessions.reduce((total, session) => {
      const startMinutes = timeToMinutes(session.startTime);
      const endMinutes = timeToMinutes(session.endTime);
      return total + (endMinutes - startMinutes) / 60;
    }, 0);

    summary.push({
      date: dateString,
      totalHours: Math.round(totalHours * 100) / 100,
      sessionCount: daySessions.length,
    });
  }

  return summary;
};
