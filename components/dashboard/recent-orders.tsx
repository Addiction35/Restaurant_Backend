import type { Order } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No recent orders found</div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="font-medium">{order.tableNumber}</div>
                  <div className="text-sm text-gray-500">{order.items} items</div>
                  <div className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${order.total.toFixed(2)}</div>
                  <div className="flex gap-2 mt-1 justify-end">
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

