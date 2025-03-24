"use client"

import type { Table } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

interface TableGridProps {
  tables: Table[]
  onTableClick: (table: Table) => void
}

export function TableGrid({ tables, onTableClick }: TableGridProps) {
  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "Available":
        return "bg-green-100 border-green-200 text-green-800"
      case "Occupied":
        return "bg-red-100 border-red-200 text-red-800"
      case "Reserved":
        return "bg-blue-100 border-blue-200 text-blue-800"
      default:
        return "bg-gray-100 border-gray-200 text-gray-800"
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tables.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">No tables found</div>
      ) : (
        tables.map((table) => (
          <Card
            key={table.id}
            className={`cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(table.status)}`}
            onClick={() => onTableClick(table)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">Table {table.number}</h3>
                  <p className="text-sm">{table.section}</p>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">{table.capacity}</span>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-sm font-medium">
                  Status: <span>{table.status}</span>
                </div>
                {table.customer && <div className="text-sm mt-1">Customer: {table.customer}</div>}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

