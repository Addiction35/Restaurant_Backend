"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePOS } from "@/context/pos-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Reservation, Table } from "@/lib/data"

interface ReservationFormProps {
  onClose: () => void
  existingReservation?: Reservation
}

export function ReservationForm({ onClose, existingReservation }: ReservationFormProps) {
  const { tables, createReservation, updateReservation } = usePOS()
  const { toast } = useToast()

  const [availableTables, setAvailableTables] = useState<Table[]>([])

  // Form state
  const [customerName, setCustomerName] = useState(existingReservation?.customerName || "")
  const [contactPhone, setContactPhone] = useState(existingReservation?.contactPhone || "")
  const [email, setEmail] = useState(existingReservation?.email || "")
  const [date, setDate] = useState(existingReservation?.date || new Date().toISOString().split("T")[0])
  const [time, setTime] = useState(existingReservation?.time || "18:00")
  const [duration, setDuration] = useState(existingReservation?.duration.toString() || "120")
  const [partySize, setPartySize] = useState(existingReservation?.partySize.toString() || "2")
  const [tableId, setTableId] = useState(existingReservation?.tableId || "")
  const [notes, setNotes] = useState(existingReservation?.notes || "")

  // Filter available tables based on party size
  useEffect(() => {
    const partySizeNum = Number.parseInt(partySize)
    const filtered = tables.filter((table) => {
      // If editing, include the currently assigned table
      if (existingReservation && table.id === existingReservation.tableId) {
        return true
      }

      // Only include available tables with sufficient capacity
      return table.status === "Available" && table.capacity >= partySizeNum
    })

    setAvailableTables(filtered)

    // If no table is selected or the selected table doesn't have enough capacity, reset selection
    if (tableId && !filtered.some((t) => t.id === tableId)) {
      setTableId("")
    }
  }, [tables, partySize, existingReservation, tableId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!tableId) {
      toast({
        title: "Error",
        description: "Please select a table",
        variant: "destructive",
      })
      return
    }

    try {
      const reservationData = {
        tableId,
        customerName,
        contactPhone,
        email: email || undefined,
        date,
        time,
        duration: Number.parseInt(duration),
        partySize: Number.parseInt(partySize),
        status: existingReservation?.status || "Confirmed",
        notes: notes || undefined,
      }

      if (existingReservation) {
        // Update existing reservation
        await updateReservation(existingReservation.id, reservationData)
        toast({
          title: "Reservation updated",
          description: `Reservation for ${customerName} has been updated`,
        })
      } else {
        // Create new reservation
        await createReservation(reservationData as Omit<Reservation, "id">)
        toast({
          title: "Reservation created",
          description: `Reservation for ${customerName} has been created`,
        })
      }

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: existingReservation ? "Failed to update reservation" : "Failed to create reservation",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{existingReservation ? "Edit Reservation" : "Create New Reservation"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                  <SelectItem value="180">180 minutes</SelectItem>
                  <SelectItem value="240">240 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="partySize">Party Size</Label>
              <Input
                id="partySize"
                type="number"
                min="1"
                max="20"
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tableId">Table</Label>
            <Select value={tableId} onValueChange={setTableId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {availableTables.length === 0 ? (
                  <SelectItem value="" disabled>
                    No suitable tables available
                  </SelectItem>
                ) : (
                  availableTables.map((table) => (
                    <SelectItem key={table.id} value={table.id}>
                      Table {table.number} ({table.section}, {table.capacity} seats)
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or notes"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{existingReservation ? "Update Reservation" : "Create Reservation"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

