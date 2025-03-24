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

interface ExpenseReportProps {
  transactions: FinancialTransaction[]
  dateRange: {
    startDate: string
    endDate: string
  }
}

export function ExpenseReport({ transactions, dateRange }: ExpenseReportProps) {
  // Filter expense transactions within date range
  const expenseTransactions = useMemo(() => {
    const startDate = new Date(dateRange.startDate).getTime()
    const endDate = new Date(dateRange.endDate).getTime() + 86400000 // Add one day to include the end date

    return transactions.filter(
      (tx) =>
        tx.type === "Expense" &&
        new Date(tx.timestamp).getTime() >= startDate &&
        new Date(tx.timestamp).getTime() <= endDate,
    )
  }, [transactions, dateRange])

  // Calculate total expenses
  const totalExpenses = useMemo(() => {
    return expenseTransactions.reduce((sum, tx) => sum + tx.amount, 0)
  }, [expenseTransactions])

  // Calculate expenses by category
  const expensesByCategory = useMemo(() => {
    const categoryMap: Record<string, number> = {}

    expenseTransactions.forEach((tx) => {
      const category = tx.category || "Uncategorized"
      if (!categoryMap[category]) {
        categoryMap[category] = 0
      }
      categoryMap[category] += tx.amount
    })

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: Number.parseFloat(value.toFixed(2)),
    }))
  }, [expenseTransactions])

  // Calculate monthly expenses
  const monthlyExpenses = useMemo(() => {
    const expensesByMonth: Record<string, number> = {}

    expenseTransactions.forEach((tx) => {
      const date = new Date(tx.timestamp)
      const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

      if (!expensesByMonth[monthYear]) {
        expensesByMonth[monthYear] = 0
      }
      expensesByMonth[monthYear] += tx.amount
    })

    // Convert to array for chart
    return Object.entries(expensesByMonth).map(([month, amount]) => ({
      month,
      amount: Number.parseFloat(amount.toFixed(2)),
    }))
  }, [expenseTransactions])

  // Colors for pie chart
  const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE", "#8884D8"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${totalExpenses.toFixed(2)}</div>
            <div className="text-sm text-gray-500 mt-1">
              {dateRange.startDate} to {dateRange.endDate}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Number of Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{expenseTransactions.length}</div>
            <div className="text-sm text-gray-500 mt-1">
              Avg: ${expenseTransactions.length ? (totalExpenses / expenseTransactions.length).toFixed(2) : "0.00"} per
              expense
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{expensesByCategory.length}</div>
            <div className="text-sm text-gray-500 mt-1">Different expense categories</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyExpenses} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Expenses"]} />
                <Bar dataKey="amount" fill="#f97316" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, "Expenses"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

