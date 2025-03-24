import { SidebarNav } from "@/components/sidebar-nav"
import { ReservationContent } from "@/components/reservations/reservation-content"

export default function ReservationsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ReservationContent />
      </div>
    </div>
  )
}

