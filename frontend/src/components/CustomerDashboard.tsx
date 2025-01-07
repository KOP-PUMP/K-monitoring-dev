import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  GearIcon,
  PersonIcon,
  ClockIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";

import { RecentActivity } from "./recent-activity";
import { PumpMaintenanceChart } from "@/components/chart/PumpMaintenanceChart";
import { PumpStatusChart } from "@/components/chart/PumpStatusChart";

export const CustomerDashboardPage = () => {
  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Summary Report</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pumps">Pumps</TabsTrigger>
            <TabsTrigger value="activities
            ">Activities</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Pumps
                  </CardTitle>
                  <GearIcon className="sr-only sm:not-sr-only" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Placeholder</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Customer Count
                  </CardTitle>
                  <PersonIcon className="sr-only sm:not-sr-only" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Placeholder</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Requiring Maintenance
                  </CardTitle>
                  <ClockIcon className="sr-only sm:not-sr-only" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">11</div>
                  <p className="text-xs text-muted-foreground">Placeholder</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pumps Needing Recheck
                  </CardTitle>
                  <FileTextIcon className="sr-only sm:not-sr-only" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Placeholder</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 ">
              <div className="grid col-span-4 gap-4">
                <Card className="col-span-4">
                  <PumpMaintenanceChart />
                </Card>
                <Card className="col-span-4">
                  <PumpStatusChart />
                </Card>
              </div>
              <Card className="col-span-4 md:col-span-3">
                <RecentActivity />
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
