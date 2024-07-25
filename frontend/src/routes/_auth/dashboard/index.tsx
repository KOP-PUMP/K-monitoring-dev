import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { PumpCardsList } from "@/components/PumpCardsList";

import { GearIcon, PersonIcon, ClockIcon, FileTextIcon } from "@radix-ui/react-icons";

import { PumpMaintenanceChart } from "@/components/chart/PumpMaintenanceChart";
import { PumpStatusChart } from "@/components/chart/PumpStatusChart";

const DashboardPage = () => {
  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">K-Monitoring Report</h2>
          <div className="flex items-center space-x-2">
            <Button>Add Pump</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pumps">Pumps</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Pumps</CardTitle>
                  <GearIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Placeholder</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Customer Count</CardTitle>
                  <PersonIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Placeholder</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Requiring Maintenance</CardTitle>
                  <ClockIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">11</div>
                  <p className="text-xs text-muted-foreground">Placeholder</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pumps Needing Recheck</CardTitle>
                  <FileTextIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Placeholder</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <PumpMaintenanceChart />
              </Card>
              <Card className="col-span-3">
                <PumpStatusChart />
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="pumps" className="space-y-4">
            <PumpCardsList />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export const Route = createFileRoute("/_auth/dashboard/")({
  component: DashboardPage,
});
