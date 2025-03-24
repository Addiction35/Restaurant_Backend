import { SidebarNav } from "@/components/sidebar-nav"
import { DeliveryContent } from "@/components/delivery/delivery-content"

export default function DeliveryPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DeliveryContent />
      </div>
    </div>
  )
}

