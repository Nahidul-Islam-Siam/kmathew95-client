/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { Box, Package, DollarSign, BarChart, AlertCircle, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGetAdminAnalyticsQuery } from "@/redux/service/analytics"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useGetTaskManagementQuery } from "@/redux/service/admin/taskManagemant"

// === Interfaces ===
interface MetricCardProps {
  label: string
  value: string | number
  icon: React.ElementType
  iconBgColor: string
}

interface PaymentItem {
  id: string | number
  userName: string
  userEmail: string
  transactionId: string
  amount: number
  status: string
  paymentType: string
  paymentDate: string
}

// === MetricCard Component ===
function MetricCard({ label, value, icon: Icon, iconBgColor }: MetricCardProps) {
  return (
    <Card className="shadow-md rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{label}</CardTitle>
        <div className="p-2 rounded-full" style={{ backgroundColor: iconBgColor }}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </CardContent>
    </Card>
  )
}

// === RecentTradesTable Component (Updated with Props) ===
function RecentTradesTable({ paymentData }: { paymentData: PaymentItem[] }) {

  console.log("Payment Data:", paymentData) // Debugging line;
  
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter data based on search term
  const filteredData = paymentData.filter(
    (payment) =>
      payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      Done: "bg-green-100 text-green-800 hover:bg-green-100",
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      Cancel: "bg-orange-100 text-orange-800 hover:bg-orange-100",
      IN_PROGRESS: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      DELIVERED: "bg-green-100 text-green-800 hover:bg-green-100",
      PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    }

    return (
      <Badge className={statusConfig[status as keyof typeof statusConfig] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    )
  }

  if (paymentData.length === 0) {
    return (
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">All payment history</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-6">No recent tasks or payments found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-md rounded-xl">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-gray-800">All payment history</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="text-left py-3 px-4 font-medium">User name</th>
                <th className="text-left py-3 px-4 font-medium">User Email</th>
                <th className="text-left py-3 px-4 font-medium">Payment Transaction ID</th>
                <th className="text-left py-3 px-4 font-medium">Amount</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Payment Type</th>
                <th className="text-left py-3 px-4 font-medium">Payment Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((payment, index) => (
                <tr key={payment.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="py-3 px-4 text-gray-700">{payment.userName}</td>
                  <td className="py-3 px-4 text-gray-700">{payment.userEmail}</td>
                  <td className="py-3 px-4 text-gray-700">{payment.transactionId}</td>
                  <td className="py-3 px-4 text-gray-700">${payment.amount}</td>
                  <td className="py-3 px-4">{getStatusBadge(payment.status)}</td>
                  <td className="py-3 px-4 text-gray-700">{payment.paymentType}</td>
                  <td className="py-3 px-4 text-gray-700">{payment.paymentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 py-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(pageNum)}
                className="w-8 h-8"
              >
                {pageNum}
              </Button>
            )
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// === Main Dashboard Page ===
export default function DashboardPage() {
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError, refetch } = useGetAdminAnalyticsQuery()
  const { data: recentTableData, isLoading: tasksLoading } = useGetTaskManagementQuery({})

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
    }, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [refetch])

  // Extract totals
  const totals = analyticsData?.data?.totals || null

  // === Prepare Chart Data from dailyStats ===
  const dailySales = analyticsData?.data?.dailyStats?.sales || []

  // Group by date and sum totalAmount (in case multiple entries per day)
  const groupedData = dailySales.reduce((acc: any[], item: any) => {
    const date = item.date
    const existing = acc.find((d) => d.date === date)
    if (existing) {
      existing.revenue += item.totalAmount
      existing.trades += item.count
    } else {
      acc.push({
        date: new Date(date).toLocaleDateString("en", { month: "short", day: "numeric" }), // "Aug 26"
        trades: item.count,
        revenue: item.totalAmount,
      })
    }
    return acc
  }, [])

  const chartData = groupedData.length > 0 ? groupedData : []

  // Define metrics
  const metrics = totals
    ? [
        {
          label: "Total Traders",
          value: totals.totalTraders,
          icon: Box,
          iconBgColor: "#FF8C38", // Orange
        },
        {
          label: "Total Tasks",
          value: totals.totalTask,
          icon: Package,
          iconBgColor: "#1A2B4B", // Dark Blue
        },
        {
          label: "Total Revenue",
          value: `$${totals.totalRevenue?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          icon: DollarSign,
          iconBgColor: "#FF0000", // Red
        },
        {
          label: "Pending Payments",
          value: `$${totals.totalPendingPayment?.toLocaleString()}`,
          icon: BarChart,
          iconBgColor: "#808080", // Gray
        },
      ]
    : []

  // Transform task data into payment-like history
  const transformedRecentData: PaymentItem[] =
    recentTableData?.data?.data?.map((task: any) => {
      const trader = task.trader
      const createdAt = new Date(task.createdAt)
      const formattedDate = createdAt.toLocaleString("en", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })

      return {
        id: task.id,
        userName: trader ? `${trader.fastName} ${trader.lastName}`.trim() : "No Trader Assigned",
        userEmail: trader?.userId || "N/A",
        transactionId: `TASK-${task.id.slice(-6).toUpperCase()}`,
        amount: task.max_salary || 0,
        status: task.status, // IN_PROGRESS, DELIVERED, etc.
        paymentType: task.taskType || "Task",
        paymentDate: formattedDate,
      }
    }) || []

  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarInset>
        <div className="p-4 md:p-6 lg:p-8 space-y-6">
          {/* Header */}
          <h2 className="text-lg font-semibold text-gray-700">Dashboard Overview</h2>

          {/* Metric Cards */}
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4">
            {analyticsLoading && <p className="col-span-full text-center text-gray-500">Loading metrics...</p>}
            {analyticsError && (
              <div className="col-span-full text-center text-red-500 flex items-center justify-center gap-2">
                <AlertCircle className="h-5 w-5" />
                <span>Failed to load statistics. Please try again.</span>
              </div>
            )}
            {!analyticsLoading && !analyticsError && metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          {/* Revenue & Trades Chart */}
          <Card className="shadow-md rounded-xl p-4">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">Daily Activity</CardTitle>
              <div className="text-sm font-medium text-orange-500 mt-1">Revenue & Trades</div>
            </CardHeader>
            <CardContent className="p-0 h-[300px]">
              {analyticsLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : analyticsError || chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  {analyticsError ? "Error loading chart data" : "No sales data available"}
                </div>
              ) : (
                <ChartContainer
                  config={{
                    trades: { label: "Trades", color: "orange" },
                    revenue: { label: "Revenue", color: "gray" },
                  }}
                  className="h-full w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        className="text-xs text-gray-500"
                      />
                      <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs text-gray-500" />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                      <Area
                        dataKey="trades"
                        type="monotone"
                        stroke="#FF8C38"
                        fill="#FF8C38"
                        fillOpacity={0.1}
                        strokeWidth={2}
                        name="Trades"
                      />
                      <Area
                        dataKey="revenue"
                        type="monotone"
                        stroke="#808080"
                        fill="#808080"
                        fillOpacity={0.1}
                        strokeWidth={2}
                        name="Revenue"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>

          {/* Recent Trades Table */}
          <div>
            {tasksLoading ? (
              <p className="text-center text-gray-500">Loading recent tasks...</p>
            ) : (
              <RecentTradesTable paymentData={transformedRecentData} />
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}