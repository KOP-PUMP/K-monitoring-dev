import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/table/DataTable";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { PumpDataType } from "@/data/pump_models";

import {
  GearIcon,
  PersonIcon,
  ClockIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";

import { RecentActivity } from "./recent-activity";
import { PumpMaintenanceChart } from "@/components/chart/PumpMaintenanceChart";
import { PumpStatusChart } from "@/components/chart/PumpStatusChart";
import { useGetPumpDetail, useGetDashboardStats } from "@/hook/pump/pump";

const pumpColumns: ColumnDef<PumpDataType>[] = [
  {
    accessorKey: "pump_code_name",
    header: "Pump",
    cell: ({ row }) => <div className="pl-4">{row.getValue("pump_code_name")}</div>,
  },
  {
    accessorKey: "pump_type_name",
    header: "Pump Type",
    cell: ({ row }) => <div className="pl-4">{row.getValue("pump_type_name")}</div>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <div className="pl-4">{row.getValue("location")}</div>,
  },
  {
    accessorKey: "pump_status",
    header: "Pump Status",
    cell: ({ row }) => <div className="pl-4">{row.getValue("pump_status")}</div>,
  },
  {
    id: "action",
    header: "Action",
    cell: ({ row }) => {
      const row_data = row.original;
      return (
        <Link to={`/pump/pump_detail?id=${row_data.pump_id}`}>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </Link>
      );
    },
  },
];

export const CustomerDashboardPage = () => {
  const { data: pumpDetailData } = useGetPumpDetail("");
  const { data: dashboardStats } = useGetDashboardStats();
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
                  <PersonIcon className="sr-only sm:not-sr-only" />
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
                  <ClockIcon className="sr-only sm:not-sr-only" />
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
                  <FileTextIcon className="sr-only sm:not-sr-only" />
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
          <TabsContent value="pumps" className="space-y-4">
            <Card className="w-full flex flex-col gap-4 p-4 overflow-x-hidden">
              {pumpDetailData ? (
                <DataTable
                  data={pumpDetailData}
                  columns={pumpColumns}
                  search={["pump_code_name", "pump_status"]}
                />
              ) : (
                <div>Error</div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};
