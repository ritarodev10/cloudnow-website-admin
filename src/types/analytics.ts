export type TimeRange = "24h" | "7d" | "30d" | "custom";

export interface MetricChange {
  value: number;
  change: number; // Percentage change
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  visitors: number;
  views: number;
}

export interface AnalyticsOverview {
  visitors: MetricChange;
  visits: MetricChange;
  views: MetricChange;
  bounceRate: MetricChange; // Percentage
  visitDuration: MetricChange; // Seconds
  timeSeries: TimeSeriesDataPoint[];
}

export interface AnalyticsStatsResponse {
  visitors: number;
  visits: number;
  views: number;
  bounces: number;
  totalTime: number;
  avgTime: number;
  timeSeries?: TimeSeriesDataPoint[];
}

