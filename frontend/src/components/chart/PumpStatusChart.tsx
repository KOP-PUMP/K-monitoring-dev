import { LabelList, Pie, PieChart } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
const chartData = [
  { quality: "replace", quantity: 275, fill: "hsl(var(--chart-1))" },
  { quality: "fair", quantity: 200, fill: "hsl(var(--chart-5))" },
  { quality: "acceptable", quantity: 173, fill: "hsl(var(--chart-4))" },
  { quality: "good", quantity: 90, fill: "hsl(var(--chart-2))" },
];

const chartConfig = {
  quantity: {
    label: "Quantity",
  },
  replace: {
    label: "Replace",
    color: "hsl(var(--chart-1))",
  },
  good: {
    label: "Good",
    color: "hsl(var(--chart-2))",
  },
  acceptable: {
    label: "Acceptable",
    color: "hsl(var(--chart-4))",
  },
  fair: {
    label: "Fair",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function PumpStatusChart() {
  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pump Status</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="quantity" hideLabel />} />
            <Pie data={chartData} dataKey="quantity">
              <LabelList
                dataKey="quality"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">Show estimated quality of all pumps</div>
      </CardFooter>
    </Card>
  );
}
