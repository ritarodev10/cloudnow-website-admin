"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServiceStats } from "@/types";

interface ServicesStatsProps {
  stats: ServiceStats;
}

export function ServicesStats({ stats }: ServicesStatsProps) {
  const statCards = [
    {
      title: "Total Services",
      value: stats.total,
      description: "All services",
      variant: "default" as const,
    },
    {
      title: "Active",
      value: stats.active,
      description: "Currently active",
      variant: "default" as const,
    },
    {
      title: "Inactive",
      value: stats.inactive,
      description: "Currently inactive",
      variant: "secondary" as const,
    },
    {
      title: "Draft",
      value: stats.draft,
      description: "Draft services",
      variant: "outline" as const,
    },
    {
      title: "Featured",
      value: stats.featured,
      description: "Featured services",
      variant: "default" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}




