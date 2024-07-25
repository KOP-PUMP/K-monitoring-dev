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

export function PumpMaintenanceChart() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle>Maintenance-Needed Pumps</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="Filled" stackId="a" fill="var(--color-mobile)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="Need" stackId="a" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">Show quantity of Maintenance-Needed Pumps</div>
      </CardFooter>
    </Card>
  );
}
