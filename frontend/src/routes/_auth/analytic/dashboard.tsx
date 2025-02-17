import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  GearIcon,
  PersonIcon,
  ClockIcon,
  FileTextIcon,
} from "@radix-ui/react-icons";

const AnalyticsDashboard = () => {
  const [asdad, setasdad] = useState("");
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      <div className="gap-4 flex">
        <Card className="basis-2/6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Pumps</CardTitle>
            <GearIcon />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Placeholder</p>
          </CardContent>
        </Card>
        <Card className="basis-1/6">
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
        <Card className="basis-1/6">
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
        <Card className="basis-1/6">
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
        <Card className="basis-1/6">
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
      <div className="flex gap-4">
        <Card className="flex basis-1/4">
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
        <Card className="flex basis-1/4">
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
        <Card className="flex basis-3/4">
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
    </div>
  );
};

export const Route = createFileRoute("/_auth/analytic/dashboard")({
  component: AnalyticsDashboard,
});
