"use client"

import { useEffect, useState } from "react"
import { usePOS } from "@/context/pos-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, DollarSign, ShoppingBag, Users, TrendingUp, Calendar, Clock, AlertCircle } from "lucide-react"
import { RecentOrders } from "./recent-orders"
import { TopSellingItems } from "./top-selling-items"
import { RecentTransactions } from "./recent-transactions"

interface DashboardStats {
  financial: {
    totalSales: number
    totalExpenses: number
    totalRefunds: number
    netRevenue: number
  }
  orders: {
    pending: number
    processing: number
    completed: number
    total: number
  }
  tables: {
    available: number
    occupied: number
    reserved: number
    total: number
  }
  topSellingItems: Array<{ id: string; title: string; count: number }>
  recentTransactions: any[]
}

export function DashboardContent() {
  const { getDashboardStats, orders } = usePOS()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true)
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Error loading dashboard stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [getDashboardStats])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600">Failed to load dashboard data. Please try again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <h3 className="text-2xl font-bold">${stats.financial.totalSales.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold">{stats.orders.total}</h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Available Tables</p>
                <h3 className="text-2xl font-bold">
                  {stats.tables.available}/{stats.tables.total}
                </h3>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Net Revenue</p>
                <h3 className="text-2xl font-bold">${stats.financial.netRevenue.toFixed(2)}</h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold">{stats.orders.pending}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <BarChart className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-xl font-bold">{stats.orders.processing}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <ShoppingBag className="h-5 w-5 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold">{stats.orders.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Table Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg">
                <Users className="h-5 w-5 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-xl font-bold">{stats.tables.available}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <Users className="h-5 w-5 text-orange-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Occupied</p>
                <p className="text-xl font-bold">{stats.tables.occupied}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Reserved</p>
                <p className="text-xl font-bold">{stats.tables.reserved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="items">Top Selling Items</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="orders">
          <RecentOrders orders={orders.slice(0, 5)} />
        </TabsContent>
        <TabsContent value="items">
          <TopSellingItems items={stats.topSellingItems} />
        </TabsContent>
        <TabsContent value="transactions">
          <RecentTransactions transactions={stats.recentTransactions} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

