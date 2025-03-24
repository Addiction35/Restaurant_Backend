"use client"

import { usePOS } from "@/context/pos-context"
import { Button } from "@/components/ui/button"
import { Check, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Order } from "@/lib/data"

interface OrderFooterProps {
  order: Order
  onViewDetails?: () => void
}

export function OrderFooter({ order, onViewDetails }: OrderFooterProps) {
  const { updateOrderStatus } = usePOS()
  const { toast } = useToast()

  const handleStatusChange = async (newStatus: Order["status"]) => {
    try {
      await updateOrderStatus(order.id, newStatus)
      toast({
        title: "Order updated",
        description: `Order #${order.id.substring(0, 6)} status changed to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 border-yellow-200"
      case "Processing":
        return "bg-blue-50 border-blue-200"
      case "Completed":
        return "bg-green-50 border-green-200"
      case "Cancelled":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border ${getStatusColor(order.status)}`}>
      <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center text-white font-medium">
        {order.tableNumber.replace(/[^0-9]/g, "")}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium flex items-center justify-between">
          <span>
            {order.items} Items → {order.kitchen}
          </span>
          <div className="text-xs">
            {order.status === "Pending" && (
              <span className="flex items-center text-yellow-600">
                <Clock className="h-3 w-3 mr-1" /> Pending
              </span>
            )}
            {order.status === "Processing" && (
              <span className="flex items-center text-blue-600">
                <AlertCircle className="h-3 w-3 mr-1" /> Processing
              </span>
            )}
            {order.status === "Completed" && (
              <span className="flex items-center text-green-600">
                <Check className="h-3 w-3 mr-1" /> Completed
              </span>
            )}
          </div>
        </div>
        <div className="flex mt-1 gap-2">
          <Button size="sm" variant="outline" className="h-6 text-xs px-2" onClick={onViewDetails}>
            View
          </Button>
          {order.status === "Pending" && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs px-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
              onClick={() => handleStatusChange("Processing")}
            >
              Start
            </Button>
          )}
          {order.status === "Processing" && (
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs px-2 bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
              onClick={() => handleStatusChange("Completed")}
            >
              Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

