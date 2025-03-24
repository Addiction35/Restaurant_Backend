"use client"

import { useState, useEffect } from "react"
import { usePOS } from "@/context/pos-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import type { Order, Driver } from "@/lib/data"
import { DeliveryOrderList } from "./delivery-order-list"
import { DeliveryOrderDetails } from "./delivery-order-details"
import { DeliveryForm } from "./delivery-form"
import { DriverList } from "./driver-list"
import { DriverDetails } from "./driver-details"

export function DeliveryContent() {
  const { orders, drivers } = usePOS()
  const [deliveryOrders, setDeliveryOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<"orders" | "drivers">("orders")
  const [activeStatus, setActiveStatus] = useState<Order["status"] | "All">("All")
  const [showDeliveryForm, setShowDeliveryForm] = useState(false)

  // Filter delivery orders
  useEffect(() => {
    const filtered = orders.filter((order) => order.diningMode === "Delivery")
    setDeliveryOrders(filtered)
  }, [orders])

  // Apply search and status filters
  useEffect(() => {
    let filtered = deliveryOrders

    // Filter by status
    if (activeStatus !== "All") {
      filtered = filtered.filter((order) => order.status === activeStatus)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (order) =>
          order.tableNumber.toLowerCase().includes(query) ||
          (order.deliveryInfo?.contactName && order.deliveryInfo.contactName.toLowerCase().includes(query)) ||
          (order.deliveryInfo?.address && order.deliveryInfo.address.toLowerCase().includes(query)),
      )
    }

    setFilteredOrders(filtered)
  }, [deliveryOrders, searchQuery, activeStatus])

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order)
    setSelectedDriver(null)
  }

  const handleDriverClick = (driver: Driver) => {
    setSelectedDriver(driver)
    setSelectedOrder(null)
  }

  const handleCloseDetails = () => {
    setSelectedOrder(null)
    setSelectedDriver(null)
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Delivery Management</h1>
          <Button onClick={() => setShowDeliveryForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Delivery Order
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={activeTab === "orders" ? "Search orders..." : "Search drivers..."}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="orders" className="w-full" onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="orders">Delivery Orders</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-0">
              <Tabs defaultValue="All" onValueChange={(value) => setActiveStatus(value as any)}>
                <TabsList className="mb-4">
                  <TabsTrigger value="All">All</TabsTrigger>
                  <TabsTrigger value="Pending">Pending</TabsTrigger>
                  <TabsTrigger value="Processing">Processing</TabsTrigger>
                  <TabsTrigger value="Completed">Completed</TabsTrigger>
                  <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value="All" className="mt-0">
                  <DeliveryOrderList orders={filteredOrders} onOrderClick={handleOrderClick} />
                </TabsContent>

                {["Pending", "Processing", "Completed", "Cancelled"].map((status) => (
                  <TabsContent key={status} value={status} className="mt-0">
                    <DeliveryOrderList
                      orders={filteredOrders.filter((o) => o.status === status)}
                      onOrderClick={handleOrderClick}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>

            <TabsContent value="drivers" className="mt-0">
              <DriverList drivers={drivers} onDriverClick={handleDriverClick} />
            </TabsContent>
          </Tabs>
        </div>

        {selectedOrder && (
          <div className="w-[400px] border-l bg-white overflow-auto">
            <DeliveryOrderDetails order={selectedOrder} onClose={handleCloseDetails} />
          </div>
        )}

        {selectedDriver && (
          <div className="w-[400px] border-l bg-white overflow-auto">
            <DriverDetails driver={selectedDriver} onClose={handleCloseDetails} />
          </div>
        )}
      </div>

      {showDeliveryForm && <DeliveryForm onClose={() => setShowDeliveryForm(false)} />}
    </div>
  )
}

