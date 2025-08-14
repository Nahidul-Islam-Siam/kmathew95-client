/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export default function MonthlyRevenueChart() {
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchChartData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate network delay
      setChartData([
        { month: "S", trades: 10000, revenue: 12000 },
        { month: "M", trades: 12000, revenue: 15000 },
        { month: "T", trades: 15000, revenue: 18000 },
        { month: "W", trades: 11000, revenue: 13000 },
        { month: "F", trades: 18000, revenue: 22000 },
        { month: "S", trades: 25000, revenue: 30000 },
        { month: "S", trades: 20000, revenue: 24000 },
      ]);
      setIsLoading(false);
    };
    fetchChartData();
  }, []);

  if (isLoading) {
    return (
      <Card className="shadow-md rounded-xl h-full flex items-center justify-center min-h-[300px]">
        {" "}
        {/* Added min-height */}
        <p>Loading chart data...</p>
      </Card>
    );
  }

  return (
    <Card className="shadow-md rounded-xl h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Monthly revenue
        </CardTitle>{" "}
        {/* Adjusted text style */}
      </CardHeader>
      <CardContent>
        <div className="text-sm font-medium text-orange-500 mb-4">Trades</div>{" "}
        {/* Added "Trades" label */}
        <ChartContainer
          config={{
            trades: {
              label: "Trades",
              color: "hsl(var(--chart-1))", // Default chart color
            },
            revenue: {
              label: "Revenue",
              color: "hsl(var(--chart-2))", // Default chart color
            },
          }}
          className="min-h-[200px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs text-gray-500"
              />{" "}
              {/* Adjusted tick color */}
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs text-gray-500"
              />{" "}
              {/* Adjusted tick color */}
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Area
                dataKey="trades"
                type="monotone"
                stroke="#FF8C38" // Orange color from screenshot
                fill="#FF8C38"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                dataKey="revenue"
                type="monotone"
                stroke="#808080" // Gray color from screenshot
                fill="#808080"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
