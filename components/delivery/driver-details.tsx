"use client"

import { usePOS } from "@/context/pos-context"
import type { Driver, Order } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { X, Phone, Truck, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useState, useEffect } from "react"

interface DriverDetailsProps {
  driver: Driver
  onClose: () => void
}

export function DriverDetails({ driver, onClose }: DriverDetailsProps) {
  const { orders, completeDelivery } = usePOS()
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (driver.currentOrderId) {
      const order = orders.find((o) => o.id === driver.currentOrderId)
      setCurrentOrder(order || null)
    }
  }, [driver.currentOrderId, orders])

  const handleCompleteDelivery = async () => {
    if (!driver.currentOrderId) return

    setIsProcessing(true)
    try {
      await completeDelivery(driver.id)
      toast({
        title: "Delivery completed",
        description: "Driver is now available for new deliveries",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete delivery",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: Driver["status"]) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "On Delivery":
        return "bg-blue-100 text-blue-800"
      case "Off Duty":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Driver Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold">{driver.name}</h3>
            <Badge variant="outline" className={getStatusColor(driver.status)}>
              {driver.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-3 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div>{driver.phone}</div>
            </div>
          </div>

          <div className="flex items-center">
            <Truck className="h-5 w-5 mr-3 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Vehicle</div>
              <div>{driver.vehicle}</div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="mb-6">
          <h3 className="font-medium mb-2">Current Delivery</h3>
          {currentOrder ? (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="font-medium">Order #{currentOrder.id.substring(0, 6)}</div>
              <div className="text-sm mt-1">{currentOrder.deliveryInfo?.address}</div>
              <div className="text-sm mt-1">
                Customer: {currentOrder.deliveryInfo?.contactName} • {currentOrder.deliveryInfo?.contactPhone}
              </div>
              <div className="mt-3">
                <Button size="sm" onClick={handleCompleteDelivery} disabled={isProcessing}>
                  <Package className="h-4 w-4 mr-2" />
                  Complete Delivery
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              {driver.status === "Available"
                ? "Driver is available for new deliveries"
                : driver.status === "Off Duty"
                  ? "Driver is currently off duty"
                  : "No active delivery found"}
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end gap-2">
          {driver.status === "Available" && <Button variant="outline">Set as Off Duty</Button>}

          {driver.status === "Off Duty" && <Button>Set as Available</Button>}
        </div>
      </div>
    </div>
  )
}

