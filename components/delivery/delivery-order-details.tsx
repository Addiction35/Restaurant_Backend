"use client"

import { useState } from "react"
import { usePOS } from "@/context/pos-context"
import type { Order } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { X, MapPin, Phone, User, Truck, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

interface DeliveryOrderDetailsProps {
  order: Order
  onClose: () => void
}

export function DeliveryOrderDetails({ order, onClose }: DeliveryOrderDetailsProps) {
  const { drivers, assignDriver, updateOrderStatus, createTransaction } = usePOS()
  const [selectedDriverId, setSelectedDriverId] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const availableDrivers = drivers.filter((driver) => driver.status === "Available")

  // Find the assigned driver if any
  const assignedDriver = order.deliveryInfo?.driverId
    ? drivers.find((driver) => driver.id === order.deliveryInfo?.driverId)
    : null

  const handleAssignDriver = async () => {
    if (!selectedDriverId) {
      toast({
        title: "Error",
        description: "Please select a driver",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      await assignDriver(order.id, selectedDriverId)
      toast({
        title: "Driver assigned",
        description: "Driver has been assigned to this delivery",
      })
      setSelectedDriverId("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign driver",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUpdateStatus = async (status: Order["status"]) => {
    setIsProcessing(true)
    try {
      await updateOrderStatus(order.id, status)
      toast({
        title: "Order updated",
        description: `Order status changed to ${status}`,
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
        method: "Cash", // Default to cash, could be made selectable
        staffId: "1", // Default admin user
        description: `Payment for delivery order #${order.id.substring(0, 6)}`,
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

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Delivery Order</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold">Order #{order.id.substring(0, 6)}</h3>
            <div className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString()}</div>
          </div>
          <Badge variant="outline" className={getStatusColor(order.status)}>
            {order.status}
          </Badge>
        </div>

        {order.deliveryInfo && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Customer</div>
                <div>{order.deliveryInfo.contactName}</div>
              </div>
            </div>

            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <div>{order.deliveryInfo.contactPhone}</div>
              </div>
            </div>

            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Address</div>
                <div>{order.deliveryInfo.address}</div>
              </div>
            </div>

            {order.deliveryInfo.deliveryNotes && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium mb-1">Delivery Notes:</div>
                <div className="text-sm">{order.deliveryInfo.deliveryNotes}</div>
              </div>
            )}
          </div>
        )}

        <Separator className="my-4" />

        <div className="mb-6">
          <h3 className="font-medium mb-2">Order Items</h3>
          <div className="space-y-3">
            {order.cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-gray-500">
                    {item.quantity} x ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className="font-medium">${(item.quantity * item.price).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t pt-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="mb-6">
          <h3 className="font-medium mb-2">Driver Assignment</h3>
          {assignedDriver ? (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-blue-600" />
                <div>
                  <div className="font-medium">{assignedDriver.name}</div>
                  <div className="text-sm">
                    {assignedDriver.phone} • {assignedDriver.vehicle}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Select value={selectedDriverId} onValueChange={setSelectedDriverId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  {availableDrivers.length === 0 ? (
                    <SelectItem value="" disabled>
                      No available drivers
                    </SelectItem>
                  ) : (
                    availableDrivers.map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.name} ({driver.vehicle})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Button onClick={handleAssignDriver} disabled={!selectedDriverId || isProcessing} className="w-full">
                Assign Driver
              </Button>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="space-y-3">
          <h3 className="font-medium mb-2">Order Actions</h3>

          {order.status === "Pending" && (
            <Button className="w-full" onClick={() => handleUpdateStatus("Processing")} disabled={isProcessing}>
              Start Processing
            </Button>
          )}

          {order.status === "Processing" && (
            <Button className="w-full" onClick={() => handleUpdateStatus("Completed")} disabled={isProcessing}>
              Mark as Delivered
            </Button>
          )}

          {order.paymentStatus !== "Paid" && (
            <Button variant="outline" className="w-full" onClick={handleMarkAsPaid} disabled={isProcessing}>
              <DollarSign className="h-4 w-4 mr-2" />
              Mark as Paid
            </Button>
          )}

          {(order.status === "Pending" || order.status === "Processing") && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => handleUpdateStatus("Cancelled")}
              disabled={isProcessing}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

