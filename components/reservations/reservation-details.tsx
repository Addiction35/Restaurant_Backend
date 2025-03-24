"use client"

import { useState } from "react"
import { usePOS } from "@/context/pos-context"
import type { Reservation } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { X, Edit2, Calendar, Clock, Users, Phone, Mail } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ReservationForm } from "./reservation-form"

interface ReservationDetailsProps {
  reservation: Reservation
  onClose: () => void
}

export function ReservationDetails({ reservation, onClose }: ReservationDetailsProps) {
  const { tables, cancelReservation } = usePOS()
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const table = tables.find((t) => t.id === reservation.tableId)

  const handleCancel = async () => {
    try {
      const success = await cancelReservation(reservation.id)
      if (success) {
        toast({
          title: "Reservation cancelled",
          description: `Reservation for ${reservation.customerName} has been cancelled`,
        })
      } else {
        throw new Error("Failed to cancel reservation")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel reservation",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isEditing) {
    return <ReservationForm onClose={() => setIsEditing(false)} existingReservation={reservation} />
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Reservation Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold">{reservation.customerName}</h3>
            <Badge variant="outline" className={getStatusColor(reservation.status)}>
              {reservation.status}
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-3 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Date</div>
              <div>{formatDate(reservation.date)}</div>
            </div>
          </div>

          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-3 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Time</div>
              <div>
                {reservation.time} ({reservation.duration} minutes)
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Users className="h-5 w-5 mr-3 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Party Size</div>
              <div>{reservation.partySize} guests</div>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-3 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div>{reservation.contactPhone}</div>
            </div>
          </div>

          {reservation.email && (
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-3 text-gray-500" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div>{reservation.email}</div>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="mb-6">
          <h3 className="font-medium mb-2">Table Information</h3>
          {table ? (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium">Table {table.number}</div>
              <div className="text-sm text-gray-500">Section: {table.section}</div>
              <div className="text-sm text-gray-500">Capacity: {table.capacity} guests</div>
            </div>
          ) : (
            <div className="text-gray-500">Table information not available</div>
          )}
        </div>

        {reservation.notes && (
          <>
            <Separator className="my-4" />
            <div className="mb-6">
              <h3 className="font-medium mb-2">Notes</h3>
              <div className="bg-gray-50 p-3 rounded-lg">{reservation.notes}</div>
            </div>
          </>
        )}

        <Separator className="my-4" />

        <div className="flex justify-end gap-2">
          {reservation.status !== "Cancelled" && reservation.status !== "Completed" && (
            <Button variant="destructive" onClick={handleCancel}>
              Cancel Reservation
            </Button>
          )}
          {reservation.status === "Pending" && <Button>Confirm Reservation</Button>}
        </div>
      </div>
    </div>
  )
}

