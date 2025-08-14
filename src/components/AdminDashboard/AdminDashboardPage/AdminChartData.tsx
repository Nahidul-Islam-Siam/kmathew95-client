"use client"

import { useEffect, useState } from "react"
import AdminRevenueChart from "./AdminRevenueChart"

export default function AdminChartData() {
  const [statsData, setStatsData] = useState<Record<string, number> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchChartData = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay
      setStatsData({
        Monday: 1200,
        Tuesday: 1500,
        Wednesday: 1300,
        Thursday: 1700,
        Friday: 1600,
        Saturday: 2000,
        Sunday: 1800,
      })
      setIsLoading(false)
    }
    fetchChartData()
  }, [])

  const weeklyData = statsData
    ? Object.entries(statsData).map(([day, value]) => ({
        day,
        sales: typeof value === "number" ? value : 0,
        orders: Math.floor(value / 10), // Example: orders are 10% of sales
      }))
    : []

  if (isLoading) {
    return <div className="p-4 text-center">Loading chart data...</div>
  }

  return <AdminRevenueChart title="Weekly Sales" weeklyData={weeklyData} />
}
