/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Box, Package, DollarSign, BarChart } from "lucide-react";
import MetricCard from "@/components/AdminDashboard/AdminDashboardPage/MetricCard";
import MonthlyRevenueChart from "@/components/AdminDashboard/AdminDashboardPage/MonthlyRevenueChart";
import RecentTradesTable from "@/components/AdminDashboard/AdminDashboardPage/RecentTradesTable";

export default function DashboardPage() {
  const [metricData, setMetricData] = useState<any>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [errorMetrics, setErrorMetrics] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call for metric stats
    const fetchMetricStats = async () => {
      setIsLoadingMetrics(true);
      setErrorMetrics(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate network delay
        setMetricData({
          totalTrades: 126,
          
          totalTask: 5426,
          totalRevenue: 16345426,
          thisMonthTrades: 13426,
        });
      } catch (e) {
        setErrorMetrics("Failed to load statistics.");
      } finally {
        setIsLoadingMetrics(false);
      }
    };
    fetchMetricStats();
  }, []);

  const metrics = metricData
    ? [
        {
          label: "Total Trades",
          value: metricData.totalTrades,
          icon: Box,
          iconBgColor: "#FF8C38", // Orange
        },
        {
          label: "Total Task",
          value: metricData.totalTask,
          icon: Package,
          iconBgColor: "#1A2B4B", // Dark Blue
        },
        {
          label: "Total Revenue",
          value: `$${metricData.totalRevenue.toLocaleString()}`,
          icon: DollarSign,
          iconBgColor: "#FF0000", // Red
        },
        {
          label: "This Month Trades",
          value: `$${metricData.thisMonthTrades.toLocaleString()}`,
          icon: BarChart,
          iconBgColor: "#808080", // Gray
        },
      ]
    : [];

  return (
    <SidebarProvider defaultOpen={true}>
      {/* <DashboardSidebar /> */}
      <SidebarInset>
        {/* <DashboardHeader /> */}
        <div className="p-4 md:p-6 lg:p-8">
          {" "}
          {/* Adjusted padding */}
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Dashboard Overview
          </h2>{" "}
          {/* Adjusted text style */}
          {/* Metric Cards */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
            {isLoadingMetrics && (
              <p className="col-span-full text-center">Loading metrics...</p>
            )}
            {errorMetrics && (
              <p className="col-span-full text-center text-red-500">
                {errorMetrics}
              </p>
            )}
            {!isLoadingMetrics &&
              !errorMetrics &&
              metrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
          </div>
          {/* Monthly Revenue Chart */}
          <div className="mt-6">
            <MonthlyRevenueChart />
          </div>
          {/* Recent Trades Table */}
          <div className="mt-6">
            <RecentTradesTable />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
