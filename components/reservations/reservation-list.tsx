"use client"

import type { Reservation } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Phone } from "lucide-react"

interface ReservationListProps {
  reservations: Reservation[]
  onReservationClick: (reservation: Reservation) => void
}

export function ReservationList({ reservations, onReservationClick }: ReservationListProps) {
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
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      {reservations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No reservations found</div>
      ) : (
        reservations.map((reservation) => (
          <Card
            key={reservation.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onReservationClick(reservation)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{reservation.customerName}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Phone className="h-4 w-4 mr-1" />
                    {reservation.contactPhone}
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(reservation.status)}>
                  {reservation.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm">{formatDate(reservation.date)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm">{reservation.time}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-gray-500" />
                  <span className="text-sm">{reservation.partySize} guests</span>
                </div>
              </div>

              {reservation.notes && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Notes:</span> {reservation.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

