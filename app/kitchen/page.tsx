import { SidebarNav } from "@/components/sidebar-nav"
import { KitchenView } from "@/components/kitchen/kitchen-view"

export default function KitchenPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <KitchenView />
      </div>
    </div>
  )
}

