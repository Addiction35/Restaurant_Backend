"use client"

import type { Order } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, DollarSign, Truck } from "lucide-react"

interface DeliveryOrderListProps {
  orders: Order[]
  onOrderClick: (order: Order) => void
}

export function DeliveryOrderList({ orders, onOrderClick }: DeliveryOrderListProps) {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Processing":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Unpaid":
        return "bg-red-100 text-red-800"
      case "Partial":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No delivery orders found</div>
      ) : (
        orders.map((order) => (
          <Card
            key={order.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onOrderClick(order)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">Order #{order.id.substring(0, 6)}</h3>
                  <div className="text-sm text-gray-500 mt-1">{new Date(order.timestamp).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {order.deliveryInfo && (
                  <>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="truncate">{order.deliveryInfo.address}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{order.deliveryInfo.estimatedDeliveryTime || "Not estimated"}</span>
                    </div>
                  </>
                )}

                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                  <span>${order.total.toFixed(2)}</span>
                </div>

                {order.deliveryInfo?.driverId && (
                  <div className="flex items-center text-sm">
                    <Truck className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Driver assigned</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

