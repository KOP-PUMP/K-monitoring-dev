import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
/* import {useSendLineNotification} from "@/hook/line_notification"; */
import {
  GearIcon,
  PersonIcon,
  ClockIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";

import { PumpMaintenanceChart } from "@/components/chart/PumpMaintenanceChart";
import { PumpStatusChart } from "@/components/chart/PumpStatusChart";
import { useGetDashboardStats } from "@/hook/pump/pump";

const DashboardPage = () => {
  const { data: dashboardStats } = useGetDashboardStats();
  /* const { mutate: sendLineNotification } = useSendLineNotification(); */

  /* const handleNotificationClick = () => {
  sendLineNotification();
}; */

  return (
    <>
      <div className="flex-1 space-y-4 px-4 sm:p-8 sm:pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            K-Monitoring Report
          </h2>
          <div className="hidden sm:flex items-center space-x-2">
            <Link to="/pump/detail">
              <Button>Add Pump</Button>
            </Link>
            {/* <Button onClick={handleNotificationClick}>Test Line Notification</Button> */}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Pumps
              </CardTitle>
              <GearIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats?.active_pumps ?? "-"}
              </div>
              <p className="text-xs text-muted-foreground">
                Good condition / Acceptable for long term use
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Customer Count
              </CardTitle>
              <PersonIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats?.customer_count ?? "-"}
              </div>
              <p className="text-xs text-muted-foreground">Customer role users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Requiring Maintenance
              </CardTitle>
              <ClockIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats?.requiring_maintenance ?? "-"}
              </div>
              <p className="text-xs text-muted-foreground">Vibration causes damage</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pumps Needing Recheck
              </CardTitle>
              <FileTextIcon />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardStats?.needing_recheck ?? "-"}
              </div>
              <p className="text-xs text-muted-foreground">
                Acceptable for short term operation / New add
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <PumpMaintenanceChart />
          </Card>
          <Card className="col-span-4 md:col-span-3">
            <PumpStatusChart />
          </Card>
        </div>
        {/* <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pumps">Pumps</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Pumps
                  </CardTitle>
                  <GearIcon />
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
                  <PersonIcon />
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
                  <ClockIcon />
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
        </Tabs> */}
      </div>
    </>
  );
};

export const Route = createFileRoute("/_auth/dashboard/")({
  component: DashboardPage,
});
