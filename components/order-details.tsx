"use client"

import { useState } from "react"
import { usePOS } from "@/context/pos-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { X, Clock, Check, AlertCircle, Printer, CreditCard, Utensils } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Order } from "@/lib/data"

interface OrderDetailsProps {
  order: Order
  onClose: () => void
}

export function OrderDetails({ order, onClose }: OrderDetailsProps) {
  const { updateOrderStatus, createTransaction } = usePOS()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleStatusChange = async (newStatus: Order["status"]) => {
    setIsProcessing(true)
    try {
      await updateOrderStatus(order.id, newStatus)
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
      setIsProcessing(false)
    }
  }

  const handleMarkAsPaid = async () => {
    if (order.paymentStatus === "Paid") {
      toast({
        title: "Already paid",
        description: "This order has already been marked as paid",
      })
      return
    }

    setIsProcessing(true)
    try {
      await createTransaction({
        orderId: order.id,
        type: "Sale",
        amount: order.total,
        method: "Cash", // Default to cash
        staffId: "1", // Default admin user
        description: `Payment for order #${order.id.substring(0, 6)}`,
      })

      toast({
        title: "Payment recorded",
        description: "Order has been marked as paid",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "Pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        )
      case "Processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Processing
          </Badge>
        )
      case "Completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <Check className="h-3 w-3 mr-1" /> Completed
          </Badge>
        )
      case "Cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <X className="h-3 w-3 mr-1" /> Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "Paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Paid
          </Badge>
        )
      case "Unpaid":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            Unpaid
          </Badge>
        )
      case "Partial":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
            Partial
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">Order #{order.id.substring(0, 6)}</h2>
          <div className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString()}</div>
          <div className="flex gap-2 mt-2">
            {getStatusBadge(order.status)}
            {getPaymentStatusBadge(order.paymentStatus)}
            <Badge variant="outline" className="bg-gray-100">
              {order.diningMode}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-sm text-gray-500">Table</h3>
          <p className="font-medium">{order.tableNumber}</p>
        </div>
        <div>
          <h3 className="font-medium text-sm text-gray-500">Server</h3>
          <p className="font-medium">{order.server || "Unknown"}</p>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-2">Order Items</h3>
        <div className="space-y-2">
          {order.cartItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="font-medium">{item.quantity}x</span>
                </div>
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500">
                    {item.type === "Veg" ? (
                      <span className="text-green-600">Vegetarian</span>
                    ) : (
                      <span className="text-red-600">Non-Vegetarian</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax (5%)</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-wrap gap-2">
        {order.status === "Pending" && (
          <Button
            onClick={() => handleStatusChange("Processing")}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Utensils className="h-4 w-4 mr-2" />
            Start Preparing
          </Button>
        )}

        {order.status === "Processing" && (
          <Button
            onClick={() => handleStatusChange("Completed")}
            disabled={isProcessing}
            className="bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark as Completed
          </Button>
        )}

        {order.paymentStatus !== "Paid" && (
          <Button variant="outline" onClick={handleMarkAsPaid} disabled={isProcessing}>
            <CreditCard className="h-4 w-4 mr-2" />
            Mark as Paid
          </Button>
        )}

        <Button variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Print Receipt
        </Button>
      </div>
    </div>
  )
}

