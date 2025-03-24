import { SidebarNav } from "@/components/sidebar-nav"
import { TableServiceContent } from "@/components/tables/table-service-content"

export default function TablesPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TableServiceContent />
      </div>
    </div>
  )
}

