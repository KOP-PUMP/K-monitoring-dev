import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "January", Need: 0, Filled: 3 },
  { month: "February", Need: 1, Filled: 4 },
  { month: "March", Need: 2, Filled: 5 },
  { month: "April", Need: 3, Filled: 7 },
  { month: "May", Need: 3, Filled: 10 },
  { month: "June", Need: 4, Filled: 14 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RecentActivity() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest 30 days ago</CardDescription>
      </CardHeader>
      <CardContent>
        
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">Footer</div>
      </CardFooter>
    </Card>
  );
}
