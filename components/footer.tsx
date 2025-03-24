"use client"

import { useState } from "react"
import { usePOS } from "@/context/pos-context"
import { OrderFooter } from "./order-footer"
import { OrderDetails } from "./order-details"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function Footer() {
  const { orders } = usePOS()
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  // Get the 3 most recent orders that are not completed
  const recentOrders = [...orders]
    .filter((order) => order.status !== "Cancelled")
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3)

  const handleViewDetails = (orderId: string) => {
    setSelectedOrder(orderId)
  }

  const selectedOrderData = orders.find((order) => order.id === selectedOrder)

  return (
    <>
      <div className="bg-white border-t p-4 flex gap-4">
        {recentOrders.length === 0 ? (
          <div className="text-center text-gray-500 w-full py-2">No recent orders. Place an order to see it here.</div>
        ) : (
          recentOrders.map((order) => (
            <div key={order.id} className="flex-1">
              <OrderFooter order={order} onViewDetails={() => handleViewDetails(order.id)} />
            </div>
          ))
        )}
      </div>

      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl">
            {selectedOrderData && <OrderDetails order={selectedOrderData} onClose={() => setSelectedOrder(null)} />}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

