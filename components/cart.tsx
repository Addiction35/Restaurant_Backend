"use client"

import { Button } from "@/components/ui/button"
import { CreditCard, QrCode, Banknote, Trash2, Table } from "lucide-react"
import { usePOS } from "@/context/pos-context"
import { CartItem } from "./cart-item"
import { DiningMode } from "./dining-mode"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { TableSelectionDialog } from "./tables/table-selection-dialog"
import { PaymentDialog } from "./payment/payment-dialog"
import type { Order } from "@/lib/data"

export function Cart() {
  const { cart, activeTable, subtotal, tax, total, placeOrder, removeFromCart, setActiveTable } = usePOS()

  const [isProcessing, setIsProcessing] = useState(false)
  const [showTableSelection, setShowTableSelection] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"Cash" | "Card" | "QR Code" | null>(null)

  const handlePlaceOrder = async (payNow = false) => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before placing an order.",
        variant: "destructive",
      })
      return
    }

    // Check if table is selected for dine-in orders
    if (!activeTable && !payNow) {
      setShowTableSelection(true)
      return
    }

    setIsProcessing(true)
    try {
      const order = await placeOrder()
      if (order) {
        setCurrentOrder(order)

        if (payNow) {
          // Open payment dialog
          setShowPaymentDialog(true)
        } else {
          toast({
            title: "Order placed successfully",
            description: `Order #${order.id.substring(0, 6)} has been sent to the kitchen.`,
            variant: "default",
          })
        }
      }
    } catch (error) {
      toast({
        title: "Error placing order",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePaymentComplete = () => {
    // Clear cart and reset state after payment
    toast({
      title: "Payment successful",
      description: "The order has been paid successfully.",
    })
  }

  const handlePaymentClick = (method: "Cash" | "Card" | "QR Code") => {
    setSelectedPaymentMethod(method)
    handlePlaceOrder(true)
  }

  return (
    <div className="w-[380px] bg-white border-l flex flex-col h-full">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{activeTable ? `Table ${activeTable.number}` : "No Table Selected"}</h2>
          <p className="text-sm text-gray-500">{activeTable?.customer || "-"}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowTableSelection(true)}>
          <Table className="h-5 w-5" />
        </Button>
      </div>
      <div className="p-4 border-b">
        <DiningMode />
      </div>
      <div className="flex-1 overflow-auto p-4">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Your cart is empty. Add items to get started.</div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="relative">
              <CartItem title={item.title} price={item.price} quantity={item.quantity} image={item.image} />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-0 right-0 text-gray-400 hover:text-red-500"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
      <div className="border-t p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Sub Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax 5%</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total Amount</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            variant="outline"
            className="flex flex-col items-center py-2"
            onClick={() => handlePaymentClick("Cash")}
            disabled={isProcessing || cart.length === 0}
          >
            <Banknote className="h-5 w-5 mb-1" />
            <span className="text-xs">Cash</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center py-2"
            onClick={() => handlePaymentClick("Card")}
            disabled={isProcessing || cart.length === 0}
          >
            <CreditCard className="h-5 w-5 mb-1" />
            <span className="text-xs">Card</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center py-2"
            onClick={() => handlePaymentClick("QR Code")}
            disabled={isProcessing || cart.length === 0}
          >
            <QrCode className="h-5 w-5 mb-1" />
            <span className="text-xs">QR Code</span>
          </Button>
        </div>
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white h-12"
          onClick={() => handlePlaceOrder(false)}
          disabled={isProcessing || cart.length === 0}
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </Button>
      </div>

      {/* Table Selection Dialog */}
      <TableSelectionDialog
        open={showTableSelection}
        onOpenChange={setShowTableSelection}
        onTableSelect={(table) => {
          setActiveTable(table)
          toast({
            title: "Table selected",
            description: `Table ${table.number} has been selected.`,
          })
        }}
      />

      {/* Payment Dialog */}
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        order={currentOrder}
        onPaymentComplete={handlePaymentComplete}
      />

      <Toaster />
    </div>
  )
}

