import { SidebarNav } from "@/components/sidebar-nav"
import { SettingsContent } from "@/components/settings/settings-content"

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SettingsContent />
      </div>
    </div>
  )
}

