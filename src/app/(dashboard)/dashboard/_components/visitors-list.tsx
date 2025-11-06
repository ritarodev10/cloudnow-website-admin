"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Visitor } from "@/types/analytics";
import { formatTimeAgo, getCountryFlag } from "./utils";

interface VisitorsListProps {
  visitors: Visitor[];
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

