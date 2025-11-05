"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTitle } from "@/components/ui/page-title";
import { AnalyticsOverview } from "@/types/analytics";
import { OverviewTab } from "./_components/overview-tab";
import { SessionTab } from "./_components/session-tab";
import { RealtimeTab } from "./_components/realtime-tab";

interface AnalyticsClientPageProps {
  initialOverview: AnalyticsOverview | null;
}

export function AnalyticsClientPage({
  initialOverview,
}: AnalyticsClientPageProps) {
  return (
    <PageTitle
      title="Analytics"
      description="Website analytics and performance metrics"
    >
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="realtime">Realtime</TabsTrigger>
          <TabsTrigger value="session">Session</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab />
        </TabsContent>

        {/* Realtime Tab */}
        <TabsContent value="realtime" className="space-y-4">
          <RealtimeTab />
        </TabsContent>

        {/* Session Tab */}
        <TabsContent value="session" className="space-y-4">
          <SessionTab />
        </TabsContent>
      </Tabs>
    </PageTitle>
  );
}

