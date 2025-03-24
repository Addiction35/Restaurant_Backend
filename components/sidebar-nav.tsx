"use client"

import {
  Menu,
  TableIcon as TableBar,
  CalendarRange,
  Truck,
  Calculator,
  Settings,
  LogOut,
  Home,
  Utensils,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { usePOS } from "@/context/pos-context"

const navItems = [
  { icon: Home, label: "Dashboard", href: "/", color: "text-gray-600" },
  { icon: Menu, label: "Menu", href: "/menu", color: "text-gray-600" },
  { icon: TableBar, label: "Table Services", href: "/tables", color: "text-gray-600" },
  { icon: CalendarRange, label: "Reservation", href: "/reservations", color: "text-gray-600" },
  { icon: Truck, label: "Delivery", href: "/delivery", color: "text-gray-600" },
  { icon: Utensils, label: "Kitchen", href: "/kitchen", color: "text-gray-600" },
  { icon: Calculator, label: "Accounting", href: "/accounting", color: "text-gray-600" },
  { icon: Settings, label: "Settings", href: "/settings", color: "text-gray-600" },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { logout } = usePOS()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="w-64 p-4 border-r h-screen">
      <div className="flex items-center gap-2 mb-8">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg"
          alt="Chili POS Logo"
          className="w-8 h-8"
        />
        <span className="font-semibold">CHILI POS</span>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start ${isActive ? "text-green-600 bg-green-50" : item.color}`}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>
      <Button
        variant="ghost"
        className="w-full justify-start mt-auto text-gray-600 fixed bottom-4 left-0 w-64 px-4"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  )
}

