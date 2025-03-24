"use client"

import { useState } from "react"
import type { Reservation } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface CalendarViewProps {
  reservations: Reservation[]
  onReservationClick: (reservation: Reservation) => void
}

export function CalendarView({ reservations, onReservationClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

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

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // Get reservations for a specific date
  const getReservationsForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return reservations.filter((r) => r.date === dateStr)
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push(date)
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Weekday headers */}
        {weekdays.map((day) => (
          <div key={day} className="text-center font-medium p-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-32 bg-gray-50 rounded-lg"></div>
          }

          const dateReservations = getReservationsForDate(date)
          const isToday = new Date().toDateString() === date.toDateString()

          return (
            <div
              key={date.toISOString()}
              className={`h-32 border rounded-lg overflow-hidden ${isToday ? "border-green-500" : ""}`}
            >
              <div className={`p-1 text-right ${isToday ? "bg-green-50" : "bg-gray-50"}`}>{date.getDate()}</div>
              <div className="p-1 overflow-y-auto h-[calc(100%-24px)]">
                {dateReservations.length === 0 ? (
                  <div className="text-xs text-gray-400">No reservations</div>
                ) : (
                  dateReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="text-xs mb-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => onReservationClick(reservation)}
                    >
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(reservation.status)} text-[10px] py-0 px-1`}
                      >
                        {reservation.time}
                      </Badge>
                      <div className="truncate">{reservation.customerName}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

