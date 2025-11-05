"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Visitor } from "@/types/analytics";

interface VisitorsListProps {
  visitors: Visitor[];
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
}

function getCountryFlag(country: string): string {
  const countryFlags: Record<string, string> = {
    "United States": "🇺🇸",
    "Canada": "🇨🇦",
    "United Kingdom": "🇬🇧",
    "Germany": "🇩🇪",
    "France": "🇫🇷",
    "Australia": "🇦🇺",
    "Japan": "🇯🇵",
    "Brazil": "🇧🇷",
    "India": "🇮🇳",
    "Mexico": "🇲🇽",
    "China": "🇨🇳",
    "Spain": "🇪🇸",
    "Italy": "🇮🇹",
    "Netherlands": "🇳🇱",
    "South Korea": "🇰🇷",
    "Sweden": "🇸🇪",
    "Norway": "🇳🇴",
    "Denmark": "🇩🇰",
    "Finland": "🇫🇮",
    "Poland": "🇵🇱",
    "Russia": "🇷🇺",
    "Turkey": "🇹🇷",
    "South Africa": "🇿🇦",
    "Argentina": "🇦🇷",
    "Chile": "🇨🇱",
    "New Zealand": "🇳🇿",
    "Singapore": "🇸🇬",
    "Thailand": "🇹🇭",
    "Philippines": "🇵🇭",
    "Indonesia": "🇮🇩",
    "Malaysia": "🇲🇾",
    "Vietnam": "🇻🇳",
    "Saudi Arabia": "🇸🇦",
    "United Arab Emirates": "🇦🇪",
    "Israel": "🇮🇱",
    "Egypt": "🇪🇬",
    "Nigeria": "🇳🇬",
    "Kenya": "🇰🇪",
    "Ghana": "🇬🇭",
    "Portugal": "🇵🇹",
    "Greece": "🇬🇷",
    "Belgium": "🇧🇪",
    "Switzerland": "🇨🇭",
    "Austria": "🇦🇹",
    "Ireland": "🇮🇪",
    "Czech Republic": "🇨🇿",
    "Romania": "🇷🇴",
    "Hungary": "🇭🇺",
    "Ukraine": "🇺🇦",
    "Colombia": "🇨🇴",
    "Peru": "🇵🇪",
    "Venezuela": "🇻🇪",
    "Ecuador": "🇪🇨",
  };
  return countryFlags[country] || "🌍";
}

export function VisitorsList({ visitors }: VisitorsListProps) {
  if (!visitors || visitors.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            No visitors data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Recent Visitors</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-2 flex-1">
          {visitors.map((visitor) => (
            <div
              key={visitor.id}
              className="flex items-center gap-2 pb-2 border-b last:border-0 last:pb-0"
            >
              <div className="flex-shrink-0 text-xl">
                {getCountryFlag(visitor.country)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap text-sm">
                  <span className="font-medium text-gray-900">
                    {visitor.city}, {visitor.country}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{visitor.os}</span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-500">
                    {formatTimeAgo(visitor.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

