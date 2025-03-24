import { SidebarNav } from "@/components/sidebar-nav"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardContent />
      </div>
    </div>
  )
}

