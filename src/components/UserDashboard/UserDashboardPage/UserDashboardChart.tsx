"use client";

import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const data = [
  { month: "Jan", profit: 150 },
  { month: "Feb", profit: 200 },
  { month: "Mar", profit: 75 },
  { month: "Apr", profit: 275 },
  { month: "May", profit: 100 },
  { month: "Jun", profit: 350 },
  { month: "Jul", profit: 280 },
];

const chartConfig = {
  profit: {
    label: "Profit",
    color: "#f97316",
  },
};

export default function UserDashboardChart() {
  return (
    <div className="w-full max-w-full p-4 md:p-6 bg-slate-800 rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-white text-base md:text-lg font-medium">
          Your Profit View
        </h2>
        <Select defaultValue="this-month">
          <SelectTrigger className="w-full sm:w-32 bg-slate-700 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-700 border-slate-600">
            <SelectItem value="this-month" className="text-white">
              This month
            </SelectItem>
            <SelectItem value="last-month" className="text-white">
              Last month
            </SelectItem>
            <SelectItem value="this-year" className="text-white">
              This year
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] sm:h-[400px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
                domain={[0, 400]}
                ticks={[0, 100, 200, 300, 400]}
              />
              <defs>
                <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#475569" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#475569" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ fill: "#f97316", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: "#f97316" }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [`$${value}`, "Profit"]}
                    labelStyle={{ color: "#f1f5f9" }}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #475569",
                      borderRadius: "6px",
                    }}
                  />
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Grid Lines */}
      <style jsx>{`
        .recharts-cartesian-grid-horizontal line,
        .recharts-cartesian-grid-vertical line {
          stroke: #475569;
          stroke-dasharray: 3 3;
          stroke-opacity: 0.3;
        }
      `}</style>
    </div>
  );
}
