"use client"

import type React from "react"

import { useState } from "react"
import { usePOS } from "@/context/pos-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface DeliveryFormProps {
  onClose: () => void
}

export function DeliveryForm({ onClose }: DeliveryFormProps) {
  const { setDeliveryInfo, setDiningMode } = usePOS()
  const { toast } = useToast()
  const router = useRouter()

  // Form state
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [address, setAddress] = useState("")
  const [deliveryNotes, setDeliveryNotes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Set delivery info in context
      setDeliveryInfo({
        contactName,
        contactPhone,
        address,
        deliveryNotes,
      })

      // Set dining mode to Delivery
      setDiningMode("Delivery")

      toast({
        title: "Delivery info saved",
        description: "You can now add items to the order",
      })

      // Close the form and navigate to menu page
      onClose()
      router.push("/menu")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save delivery information",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Delivery Order</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Customer Name</Label>
            <Input
              id="contactName"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone Number</Label>
            <Input
              id="contactPhone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Delivery Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter delivery address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryNotes">Delivery Notes (Optional)</Label>
            <Textarea
              id="deliveryNotes"
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="Any special instructions for delivery"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Continue to Menu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

