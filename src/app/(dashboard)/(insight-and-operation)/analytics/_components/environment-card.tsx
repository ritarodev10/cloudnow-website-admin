"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnvironmentMetrics, LocationMetric } from "@/types/analytics";
import { useEnvironmentMetrics } from "../_hooks/queries/use-environment-metrics";
import { TimeRange } from "@/types/analytics";

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

// Utility function to format OS name
function formatOSName(os: string): string {
  const osLower = os.toLowerCase();
  if (osLower.includes("mac")) return "Mac OS";
  if (osLower.includes("windows")) {
    // Try to preserve version if present
    if (os.match(/windows\s*\d+/i)) {
      return os.charAt(0).toUpperCase() + os.slice(1);
    }
    return os.charAt(0).toUpperCase() + os.slice(1);
  }
  if (osLower.includes("android")) return "Android OS";
  // Capitalize first letter
  return os.charAt(0).toUpperCase() + os.slice(1);
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

// Utility function to format device name
function formatDeviceName(device: string): string {
  const deviceLower = device.toLowerCase();
  if (deviceLower.includes("desktop")) return "Laptop";
  if (deviceLower.includes("mobile")) return "Mobile";
  if (deviceLower.includes("tablet")) return "Tablet";
  // Capitalize first letter
  return device.charAt(0).toUpperCase() + device.slice(1);
}

interface EnvironmentCardProps {
  timeRange: TimeRange;
}

export function EnvironmentCard({ timeRange }: EnvironmentCardProps) {
  const [activeTab, setActiveTab] = useState<"browser" | "os" | "device">(
    "device"
  );
  const {
    data: environmentData,
    isLoading,
    error,
  } = useEnvironmentMetrics({
    range: timeRange,
    limit: 10,
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-600 text-sm py-4">
            Error loading environment data: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !environmentData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground text-sm py-4">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDataForTab = (
    tab: "browser" | "os" | "device"
  ): LocationMetric[] => {
    switch (tab) {
      case "browser":
        return environmentData.browsers;
      case "os":
        return environmentData.os;
      case "device":
        return environmentData.devices;
      default:
        return [];
    }
  };

  const getTotalVisitors = (data: LocationMetric[]): number => {
    return data.reduce((sum, item) => sum + item.y, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "browser" | "os" | "device")
          }
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="device">Devices</TabsTrigger>
            <TabsTrigger value="os">OS</TabsTrigger>
            <TabsTrigger value="browser">Browsers</TabsTrigger>
          </TabsList>

          <TabsContent value="device" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 pb-2 border-b">
                <span>Device</span>
                <span>Visitors</span>
              </div>
              {(() => {
                const data = getDataForTab("device");
                const totalVisitors = getTotalVisitors(data);
                return data.length > 0 ? (
                  <>
                    {data.map((item, index) => {
                      const percentage =
                        totalVisitors > 0
                          ? ((item.y / totalVisitors) * 100).toFixed(0)
                          : "0";
                      return (
                        <div
                          key={`${item.x}-${index}`}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <i className={getDeviceIcon(item.x)} />
                            <span className="text-sm truncate">
                              {formatDeviceName(item.x)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{item.y}</span>
                            <span className="text-xs text-muted-foreground">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No devices data available
                  </div>
                );
              })()}
            </div>
          </TabsContent>

          <TabsContent value="os" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 pb-2 border-b">
                <span>OS</span>
                <span>Visitors</span>
              </div>
              {(() => {
                const data = getDataForTab("os");
                const totalVisitors = getTotalVisitors(data);
                return data.length > 0 ? (
                  <>
                    {data.map((item, index) => {
                      const percentage =
                        totalVisitors > 0
                          ? ((item.y / totalVisitors) * 100).toFixed(0)
                          : "0";
                      return (
                        <div
                          key={`${item.x}-${index}`}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <i className={getOSIcon(item.x)} />
                            <span className="text-sm truncate">
                              {formatOSName(item.x)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{item.y}</span>
                            <span className="text-xs text-muted-foreground">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No OS data available
                  </div>
                );
              })()}
            </div>
          </TabsContent>

          <TabsContent value="browser" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2 pb-2 border-b">
                <span>Browser</span>
                <span>Visitors</span>
              </div>
              {(() => {
                const data = getDataForTab("browser");
                const totalVisitors = getTotalVisitors(data);
                return data.length > 0 ? (
                  <>
                    {data.map((item, index) => {
                      const percentage =
                        totalVisitors > 0
                          ? ((item.y / totalVisitors) * 100).toFixed(0)
                          : "0";
                      return (
                        <div
                          key={`${item.x}-${index}`}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <i className={getBrowserIcon(item.x)} />
                            <span className="text-sm truncate">
                              {formatBrowserName(item.x)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{item.y}</span>
                            <span className="text-xs text-muted-foreground">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-4">
                    No browsers data available
                  </div>
                );
              })()}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
