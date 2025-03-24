"use client"

import { useState } from "react"
import { usePOS } from "@/context/pos-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Check, AlertCircle, X, Filter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { OrderDetails } from "../order-details"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { Order } from "@/lib/data"

export function KitchenView() {
  const { orders, updateOrderStatus } = usePOS()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({})

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "pending") return order.status === "Pending"
    if (activeTab === "processing") return order.status === "Processing"
    if (activeTab === "completed") return order.status === "Completed"
    return true
  })

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    setIsProcessing((prev) => ({ ...prev, [orderId]: true }))
    try {
      await updateOrderStatus(orderId, newStatus)
      toast({
        title: "Order updated",
        description: `Order status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setIsProcessing((prev) => ({ ...prev, [orderId]: false }))
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "Processing":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case "Completed":
        return <Check className="h-4 w-4 text-green-600" />
      case "Cancelled":
        return <X className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const selectedOrderData = orders.find((order) => order.id === selectedOrder)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Kitchen Display</h1>
          <p className="text-gray-500">Manage and track food orders</p>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Tabs defaultValue="pending" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
              {orders.filter((o) => o.status === "Pending").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="processing">
            Processing
            <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
              {orders.filter((o) => o.status === "Processing").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
              {orders.filter((o) => o.status === "Completed").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
        </TabsList>

        {["pending", "processing", "completed", "all"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No {tab !== "all" ? tab : ""} orders found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-2 flex flex-row justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.substring(0, 6)}</CardTitle>
                        <div className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleTimeString()}</div>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Table:</span>
                          <span>{order.tableNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Items:</span>
                          <span>{order.items}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.cartItems.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>
                              {item.quantity}x {item.title}
                            </span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        {order.cartItems.length > 3 && (
                          <div className="text-sm text-gray-500 text-center">
                            +{order.cartItems.length - 3} more items
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" onClick={() => setSelectedOrder(order.id)}>
                          View Details
                        </Button>

                        {order.status === "Pending" && (
                          <Button
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleStatusChange(order.id, "Processing")}
                            disabled={isProcessing[order.id]}
                          >
                            Start
                          </Button>
                        )}

                        {order.status === "Processing" && (
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleStatusChange(order.id, "Completed")}
                            disabled={isProcessing[order.id]}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl">
            {selectedOrderData && <OrderDetails order={selectedOrderData} onClose={() => setSelectedOrder(null)} />}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

