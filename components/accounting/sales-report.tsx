"use client"

import { useMemo } from "react"
import type { FinancialTransaction } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface SalesReportProps {
  transactions: FinancialTransaction[]
  dateRange: {
    startDate: string
    endDate: string
  }
}

export function SalesReport({ transactions, dateRange }: SalesReportProps) {
  // Filter sales transactions within date range
  const salesTransactions = useMemo(() => {
    const startDate = new Date(dateRange.startDate).getTime()
    const endDate = new Date(dateRange.endDate).getTime() + 86400000 // Add one day to include the end date

    return transactions.filter(
      (tx) =>
        tx.type === "Sale" &&
        new Date(tx.timestamp).getTime() >= startDate &&
        new Date(tx.timestamp).getTime() <= endDate,
    )
  }, [transactions, dateRange])

  // Calculate total sales
  const totalSales = useMemo(() => {
    return salesTransactions.reduce((sum, tx) => sum + tx.amount, 0)
  }, [salesTransactions])

  // Calculate sales by payment method
  const salesByMethod = useMemo(() => {
    const methodMap: Record<string, number> = {}

    salesTransactions.forEach((tx) => {
      if (!methodMap[tx.method]) {
        methodMap[tx.method] = 0
      }
      methodMap[tx.method] += tx.amount
    })

    return Object.entries(methodMap).map(([name, value]) => ({
      name,
      value: Number.parseFloat(value.toFixed(2)),
    }))
  }, [salesTransactions])

  // Calculate daily sales for the date range
  const dailySales = useMemo(() => {
    const salesByDay: Record<string, number> = {}
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)

    // Initialize all days in range with 0
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0]
      salesByDay[dateStr] = 0
    }

    // Add sales to corresponding days
    salesTransactions.forEach((tx) => {
      const dateStr = new Date(tx.timestamp).toISOString().split("T")[0]
      if (salesByDay[dateStr] !== undefined) {
        salesByDay[dateStr] += tx.amount
      }
    })

    // Convert to array for chart
    return Object.entries(salesByDay).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      amount: Number.parseFloat(amount.toFixed(2)),
    }))
  }, [salesTransactions, dateRange])

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalSales.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mt-1">
              {dateRange.startDate} to {dateRange.endDate}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Number of Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{salesTransactions.length}</div>
            <div className="text-sm text-gray-500 mt-1">
              Avg: ${salesTransactions.length ? (totalSales / salesTransactions.length).toFixed(2) : "0.00"} per
              transaction
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${dailySales.length ? (totalSales / dailySales.length).toFixed(2) : "0.00"}
            </div>
            <div className="text-sm text-gray-500 mt-1">Over {dailySales.length} days</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySales} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                <Bar dataKey="amount" fill="#4ade80" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByMethod}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {salesByMethod.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

