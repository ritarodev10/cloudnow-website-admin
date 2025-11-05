"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTitle } from "@/components/ui/page-title";
import { AnalyticsOverview } from "@/types/analytics";
import { OverviewTab } from "./_components/overview-tab";

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
          <TabsTrigger value="pages">Pages/Routes</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns/UTM</TabsTrigger>
          <TabsTrigger value="events">Events/Conversions</TabsTrigger>
          <TabsTrigger value="funnels">Funnels</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="tech">Tech</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="exports">Exports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab />
        </TabsContent>

        {/* Placeholder tabs */}
        <TabsContent value="realtime" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Realtime analytics coming soon
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Pages/Routes analytics coming soon
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Sources analytics coming soon
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Campaigns/UTM analytics coming soon
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Events/Conversions analytics coming soon
          </div>
        </TabsContent>

        <TabsContent value="funnels" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Funnels analytics coming soon
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Geography analytics coming soon
          </div>
        </TabsContent>

        <TabsContent value="tech" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Tech analytics coming soon
          </div>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Segments analytics coming soon
          </div>
        </TabsContent>

        <TabsContent value="exports" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Exports coming soon
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="text-center text-muted-foreground py-8">
            Settings coming soon
          </div>
        </TabsContent>
      </Tabs>
    </PageTitle>
  );
}

