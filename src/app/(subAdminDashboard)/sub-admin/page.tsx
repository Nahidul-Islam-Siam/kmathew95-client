/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Box, Package, DollarSign, BarChart } from "lucide-react";
import MetricCard from "@/components/AdminDashboard/AdminDashboardPage/MetricCard";
import MonthlyRevenueChart from "@/components/AdminDashboard/AdminDashboardPage/MonthlyRevenueChart";
import RecentTradesTable from "@/components/AdminDashboard/AdminDashboardPage/RecentTradesTable";
import { useGetAdminAnalyticsQuery } from "@/redux/service/analytics";

// Import the analytics hook


export default function DashboardPage() {
  const {
    data:analyticsResponse,
    isLoading,
    error,
  } = useGetAdminAnalyticsQuery();

  // Extract totals from real data
  const totals = analyticsResponse?.data?.totals;

  const metrics = totals
    ? [
        {
          label: "Total Traders",
          value: totals.totalTraders,
          icon: Box,
          iconBgColor: "#FF8C38", // Orange
        },
        {
          label: "Total Task",
          value: totals.totalTask,
          icon: Package,
          iconBgColor: "#1A2B4B", // Dark Blue
        },
        {
          label: "Total Revenue",
          value: `$${totals.totalRevenue.toLocaleString()}`,
          icon: DollarSign,
          iconBgColor: "#FF0000", // Red
        },
        {
          label: "Pending Payments",
          value: `$${totals.totalPendingPayment.toLocaleString()}`,
          icon: BarChart,
          iconBgColor: "#808080", // Gray
        },
      ]
    : [];

  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarInset>
        <div className="p-4 md:p-6 lg:p-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Dashboard Overview
          </h2>

          {/* Metric Cards */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
            {isLoading && (
              <p className="col-span-full text-center text-gray-500">
                Loading metrics...
              </p>
            )}
            {error && (
              <p className="col-span-full text-center text-red-500">
                Failed to load statistics. Please try again.
              </p>
            )}
            {!isLoading &&
              !error &&
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