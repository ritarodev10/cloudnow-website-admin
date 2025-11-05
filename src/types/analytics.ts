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

export interface Visitor {
  id: string;
  timestamp: Date;
  country: string;
  city: string;
  os: string;
  browser?: string;
  device?: string;
  page?: string;
}

// Realtime Analytics Types
export interface RealtimeEvent {
  __type: "pageview" | "session";
  sessionId: string;
  eventName: string;
  createdAt: string;
  browser: string;
  os: string;
  device: string;
  country: string;
  urlPath?: string;
  referrerDomain?: string;
}

export interface RealtimeSeriesPoint {
  x: string;
  y: number;
}

export interface RealtimeData {
  countries: Record<string, number>;
  urls: Record<string, number>;
  referrers: Record<string, number>;
  events: RealtimeEvent[];
  series: {
    views: RealtimeSeriesPoint[];
    visitors: RealtimeSeriesPoint[];
  };
  totals: {
    views: number;
    visitors: number;
    events: number;
    countries: number;
  };
  timestamp: number;
}

// Session Analytics Types
export interface Session {
  id: string;
  websiteId: string;
  hostname: string[];
  browser: string;
  os: string;
  device: string;
  screen: string;
  language: string;
  country: string;
  region: string;
  city: string;
  firstAt: string;
  lastAt: string;
  visits: number;
  views: number;
  createdAt: string;
}

export interface SessionsResponse {
  data: Session[];
  count: number;
  page: number;
  pageSize: number;
}

// Location Metrics Types
export interface LocationMetric {
  x: string; // Location name (country, region, or city)
  y: number; // Visitor count
}

export interface LocationMetrics {
  countries: LocationMetric[];
  regions: LocationMetric[];
  cities: LocationMetric[];
}

export type LocationType = "country" | "region" | "city";

// Environment Metrics Types
export interface EnvironmentMetrics {
  browsers: LocationMetric[]; // Using LocationMetric structure (x: name, y: count)
  os: LocationMetric[];
  devices: LocationMetric[];
}

export type EnvironmentType = "channel" | "os" | "device";
