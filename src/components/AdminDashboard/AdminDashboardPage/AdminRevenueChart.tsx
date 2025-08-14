"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";

interface AdminRevenueChartProps {
  title: string;
  weeklyData: { day: string; sales: number; orders: number }[];
}

export default function AdminRevenueChart({
  title,
  weeklyData,
}: AdminRevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            sales: {
              label: "Sales",
              color: "hsl(var(--chart-1))",
            },
            orders: {
              label: "Orders",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="min-h-[200px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={weeklyData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              dataKey="sales"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="sales"
              type="monotone"
              stroke="var(--color-sales)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="orders"
              type="monotone"
              stroke="var(--color-orders)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
