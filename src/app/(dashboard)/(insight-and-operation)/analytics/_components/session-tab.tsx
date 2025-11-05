"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterButton } from "./filter-button";
import { TimeRangeSelector } from "./time-range-selector";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TimeRange } from "@/types/analytics";
import { useAnalyticsSessions } from "../_hooks/queries/use-analytics-sessions";

// Utility function to get browser icon
function getBrowserIcon(browser: string): string {
  const browserLower = browser.toLowerCase();
  if (browserLower.includes("chrome")) return "ri-chrome-line";
  if (browserLower.includes("edge")) return "ri-edge-line";
  if (browserLower.includes("firefox")) return "ri-firefox-line";
  if (browserLower.includes("safari")) return "ri-safari-line";
  if (browserLower.includes("opera")) return "ri-opera-line";
  return "ri-global-line";
}

// Utility function to format browser name
function formatBrowserName(browser: string): string {
  const browserLower = browser.toLowerCase();
  if (browserLower.includes("edge")) {
    // Check if it's Edge (Chromium)
    if (browserLower.includes("chromium") || browser.includes("Edge")) {
      return "Edge (Chromium)";
    }
    return "Edge";
  }
  // Capitalize first letter
  return browser.charAt(0).toUpperCase() + browser.slice(1);
}

// Utility function to get OS icon
function getOSIcon(os: string): string {
  const osLower = os.toLowerCase();
  if (osLower.includes("windows")) return "ri-windows-line";
  if (osLower.includes("mac")) return "ri-mac-line";
  if (osLower.includes("linux")) return "ri-ubuntu-line";
  if (osLower.includes("android")) return "ri-android-line";
  if (osLower.includes("ios")) return "ri-apple-line";
  return "ri-computer-line";
}

// Utility function to get device icon
function getDeviceIcon(device: string): string {
  const deviceLower = device.toLowerCase();
  if (deviceLower.includes("mobile")) return "ri-smartphone-line";
  if (deviceLower.includes("tablet")) return "ri-tablet-line";
  if (deviceLower.includes("desktop") || deviceLower.includes("laptop"))
    return "ri-laptop-line";
  return "ri-device-line";
}

// Utility function to get country flag emoji (simplified - using first two letters)
function getCountryFlag(country: string): string {
  // This is a simplified version - in production, you'd use a proper country flag library
  const countryMap: Record<string, string> = {
    US: "🇺🇸",
    ID: "🇮🇩",
    SG: "🇸🇬",
    GB: "🇬🇧",
    CA: "🇨🇦",
    AU: "🇦🇺",
    DE: "🇩🇪",
    FR: "🇫🇷",
    JP: "🇯🇵",
    CN: "🇨🇳",
    IN: "🇮🇳",
    BR: "🇧🇷",
    MX: "🇲🇽",
    // Add more as needed
  };
  return countryMap[country.toUpperCase()] || "🌍";
}

// Utility function to format time ago
function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `about ${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
}

// Generate avatar initials from session ID
function getAvatarInitials(sessionId: string): string {
  return sessionId.substring(0, 2).toUpperCase();
}

export function SessionTab() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"activity" | "properties">("activity");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: sessionsData, isLoading, error } = useAnalyticsSessions({
    range: timeRange,
    page,
    pageSize,
  });

  const sessions = sessionsData?.data || [];

  const handlePrevious = () => {
    // TODO: Implement previous period navigation
    console.log("Previous period");
  };

  const handleNext = () => {
    // TODO: Implement next period navigation
    console.log("Next period");
  };

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log("Filter clicked");
  };

  // Filter sessions based on search query
  const filteredSessions = sessions.filter((session) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      session.country.toLowerCase().includes(query) ||
      session.city.toLowerCase().includes(query) ||
      session.browser.toLowerCase().includes(query) ||
      session.os.toLowerCase().includes(query) ||
      session.device.toLowerCase().includes(query)
    );
  });

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <FilterButton onClick={handleFilter} />
          <TimeRangeSelector
            value={timeRange}
            onChange={setTimeRange}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
        <div className="text-center text-red-600">
          Error loading session data: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Filter and Time Range */}
      <div className="flex items-center justify-between">
        <FilterButton onClick={handleFilter} />
        <TimeRangeSelector
          value={timeRange}
          onChange={setTimeRange}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>

      {/* Main Content Card */}
      <div className="rounded-lg border bg-card p-4 space-y-4">
        {/* Sub-tabs */}
        <Tabs value={activeSubTab} onValueChange={(v) => setActiveSubTab(v as "activity" | "properties")}>
          <TabsList>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>

          {/* Activity Tab Content */}
          <TabsContent value="activity" className="space-y-4 mt-4">
            {/* Search Bar */}
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Sessions Table */}
            {isLoading ? (
              <div className="text-center text-muted-foreground py-8">Loading sessions...</div>
            ) : filteredSessions.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No sessions found</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session</TableHead>
                      <TableHead>Visits</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>Browser</TableHead>
                      <TableHead>OS</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Last seen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarFallback>
                                {getAvatarInitials(session.id)}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </TableCell>
                        <TableCell>{session.visits}</TableCell>
                        <TableCell>{session.views}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getCountryFlag(session.country)}</span>
                            <span>{session.country}</span>
                          </div>
                        </TableCell>
                        <TableCell>{session.city}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <i className={getBrowserIcon(session.browser)} />
                            <span>{formatBrowserName(session.browser)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <i className={getOSIcon(session.os)} />
                            <span>{session.os}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <i className={getDeviceIcon(session.device)} />
                            <span>
                              {session.device === "desktop"
                                ? "Laptop"
                                : session.device.charAt(0).toUpperCase() +
                                  session.device.slice(1)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{formatTimeAgo(session.lastAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Properties Tab Content */}
          <TabsContent value="properties" className="space-y-4 mt-4">
            <div className="text-center text-muted-foreground py-8">
              Properties view coming soon
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

