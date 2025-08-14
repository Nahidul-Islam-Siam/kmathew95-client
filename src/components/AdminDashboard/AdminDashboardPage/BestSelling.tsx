/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pie, PieChart, ResponsiveContainer, Cell, Label } from "recharts";
import { useEffect, useState } from "react";

// Color palette for dynamic rendering - adjusted to match screenshot's pie chart colors
const COLORS = [
  "#f59e0b",
  "#10b981",
  "#000000",
  "#22c55e",
  "#6366f1",
  "#f43f5e",
];

export default function BestSelling() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchBestSelling = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        await new Promise((resolve) => setTimeout(resolve, 700)); // Simulate network delay
        setData({
          data: [
            { category: "Electronics", percentage: 30 },
            { category: "Apparel", percentage: 25 },
            { category: "Home Goods", percentage: 20 },
            { category: "Books", percentage: 15 },
            { category: "Other", percentage: 10 },
          ],
        });
      } catch (e) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBestSelling();
  }, []);

  const renderLabel = () => (
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={12}
      fill="#6b7280"
    >
      {" "}
      {/* Adjusted label color */}
      This Week
    </text>
  );

  const pieData =
    data?.data?.map((item: any, index: number) => ({
      label: item.category,
      value: item.percentage,
      color: COLORS[index % COLORS.length],
    })) || [];

  return (
    <Card className="h-full shadow-md rounded-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          This Week
        </CardTitle>{" "}
        {/* Adjusted text style */}
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="w-[180px] h-[180px] rounded-full" />
            <Skeleton className="w-3/4 h-4" />
            <Skeleton className="w-1/2 h-4" />
          </div>
        ) : isError ? (
          <p className="text-red-500">Failed to load data</p>
        ) : (
          <>
            <div className="w-full min-w-[100px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    startAngle={90}
                    endAngle={-270}
                  >
                    {pieData.map((entry: any, index: any) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <Label content={renderLabel} position="center" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col w-full mt-4 px-2">
              {" "}
              {/* Added horizontal padding */}
              {pieData.map((item: any, index: any) => (
                <div
                  key={index}
                  className="flex justify-between mb-2 text-sm text-gray-700"
                >
                  {" "}
                  {/* Adjusted text color */}
                  <span>{item.label}</span>
                  <span style={{ color: item.color }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
