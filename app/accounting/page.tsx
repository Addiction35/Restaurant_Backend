import { SidebarNav } from "@/components/sidebar-nav"
import { AccountingContent } from "@/components/accounting/accounting-content"

export default function AccountingPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AccountingContent />
      </div>
    </div>
  )
}

