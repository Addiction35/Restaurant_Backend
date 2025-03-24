"use client"

import { useState, useEffect } from "react"
import { usePOS } from "@/context/pos-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Calendar } from "lucide-react"
import type { Reservation } from "@/lib/data"
import { ReservationList } from "./reservation-list"
import { ReservationDetails } from "./reservation-details"
import { ReservationForm } from "./reservation-form"
import { CalendarView } from "./calendar-view"

export function ReservationContent() {
  const { reservations } = usePOS()
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredReservations, setFilteredReservations] = useState(reservations)
  const [activeStatus, setActiveStatus] = useState<Reservation["status"] | "All">("All")
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")

  useEffect(() => {
    let filtered = reservations

    // Filter by status
    if (activeStatus !== "All") {
      filtered = filtered.filter((reservation) => reservation.status === activeStatus)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (reservation) =>
          reservation.customerName.toLowerCase().includes(query) ||
          reservation.contactPhone.includes(query) ||
          (reservation.email && reservation.email.toLowerCase().includes(query)),
      )
    }

    setFilteredReservations(filtered)
  }, [reservations, searchQuery, activeStatus])

  const handleReservationClick = (reservation: Reservation) => {
    setSelectedReservation(reservation)
  }

  const handleCloseDetails = () => {
    setSelectedReservation(null)
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Reservations</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}>
              {viewMode === "list" ? (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar View
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  List View
                </>
              )}
            </Button>
            <Button onClick={() => setShowReservationForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Reservation
            </Button>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search reservations..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          {viewMode === "list" ? (
            <Tabs defaultValue="All" className="w-full" onValueChange={(value) => setActiveStatus(value as any)}>
              <TabsList className="mb-4">
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Confirmed">Confirmed</TabsTrigger>
                <TabsTrigger value="Pending">Pending</TabsTrigger>
                <TabsTrigger value="Completed">Completed</TabsTrigger>
                <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value="All" className="mt-0">
                <ReservationList reservations={filteredReservations} onReservationClick={handleReservationClick} />
              </TabsContent>

              {["Confirmed", "Pending", "Completed", "Cancelled"].map((status) => (
                <TabsContent key={status} value={status} className="mt-0">
                  <ReservationList
                    reservations={filteredReservations.filter((r) => r.status === status)}
                    onReservationClick={handleReservationClick}
                  />
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <CalendarView reservations={filteredReservations} onReservationClick={handleReservationClick} />
          )}
        </div>

        {selectedReservation && (
          <div className="w-[400px] border-l bg-white overflow-auto">
            <ReservationDetails reservation={selectedReservation} onClose={handleCloseDetails} />
          </div>
        )}
      </div>

      {showReservationForm && <ReservationForm onClose={() => setShowReservationForm(false)} />}
    </div>
  )
}

