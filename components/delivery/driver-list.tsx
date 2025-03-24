"use client"

import type { Driver } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Phone, Truck } from "lucide-react"

interface DriverListProps {
  drivers: Driver[]
  onDriverClick: (driver: Driver) => void
}

export function DriverList({ drivers, onDriverClick }: DriverListProps) {
  const getStatusColor = (status: Driver["status"]) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "On Delivery":
        return "bg-blue-100 text-blue-800"
      case "Off Duty":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {drivers.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">No drivers found</div>
      ) : (
        drivers.map((driver) => (
          <Card
            key={driver.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onDriverClick(driver)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{driver.name}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Phone className="h-4 w-4 mr-1" />
                    {driver.phone}
                  </div>
                </div>
                <Badge variant="outline" className={getStatusColor(driver.status)}>
                  {driver.status}
                </Badge>
              </div>

              <div className="mt-4 flex items-center">
                <Truck className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">{driver.vehicle}</span>
              </div>

              {driver.currentOrderId && (
                <div className="mt-2 text-sm bg-blue-50 p-2 rounded">
                  Currently delivering order #{driver.currentOrderId.substring(0, 6)}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

