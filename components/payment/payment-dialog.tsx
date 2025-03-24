"use client"

import { useState } from "react"
import { usePOS } from "@/context/pos-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard, Banknote, QrCode, ArrowRight } from "lucide-react"
import type { Order } from "@/lib/data"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onPaymentComplete: () => void
}

export function PaymentDialog({ open, onOpenChange, order, onPaymentComplete }: PaymentDialogProps) {
  const { createTransaction } = usePOS()
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card" | "QR Code">("Cash")
  const [amountReceived, setAmountReceived] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvc, setCardCvc] = useState("")
  const [cardName, setCardName] = useState("")

  if (!order) return null

  const handlePayment = async () => {
    if (!order) return

    setIsProcessing(true)
    try {
      // Create transaction
      await createTransaction({
        orderId: order.id,
        type: "Sale",
        amount: order.total,
        method: paymentMethod,
        staffId: "1", // Default admin user
        description: `Payment for order #${order.id.substring(0, 6)}`,
      })

      toast({
        title: "Payment successful",
        description: `Payment of $${order.total.toFixed(2)} processed successfully`,
      })

      onPaymentComplete()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateChange = () => {
    if (!amountReceived) return 0
    const received = Number.parseFloat(amountReceived)
    return received > order.total ? received - order.total : 0
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Tax (5%):</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <Tabs defaultValue="cash" onValueChange={(value) => setPaymentMethod(value as any)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="Cash" className="flex items-center gap-2">
                <Banknote className="h-4 w-4" />
                Cash
              </TabsTrigger>
              <TabsTrigger value="Card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Card
              </TabsTrigger>
              <TabsTrigger value="QR Code" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="Cash" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amountReceived">Amount Received</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
                  <Input
                    id="amountReceived"
                    type="number"
                    step="0.01"
                    min={order.total}
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              {Number.parseFloat(amountReceived) > 0 && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex justify-between font-medium">
                    <span>Change:</span>
                    <span>${calculateChange().toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2">
                {[10, 20, 50].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    onClick={() => setAmountReceived(amount.toString())}
                  >
                    ${amount}
                  </Button>
                ))}
                {[100, 200, 500].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    onClick={() => setAmountReceived(amount.toString())}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="Card" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input id="cardCvc" placeholder="123" value={cardCvc} onChange={(e) => setCardCvc(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="QR Code" className="space-y-4">
              <div className="bg-white border rounded-lg p-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-48 h-48 mx-auto bg-gray-200 flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-gray-400" />
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    Scan this QR code with your payment app to complete the transaction
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handlePayment} disabled={isProcessing} className="bg-green-600 hover:bg-green-700">
            {isProcessing ? "Processing..." : "Complete Payment"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

