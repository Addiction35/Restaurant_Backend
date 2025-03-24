"use client"

import { useState, useEffect } from "react"
import { usePOS } from "@/context/pos-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Table } from "@/lib/data"

interface TableSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTableSelect: (table: Table) => void
}

export function TableSelectionDialog({ open, onOpenChange, onTableSelect }: TableSelectionDialogProps) {
  const { tables } = usePOS()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSection, setActiveSection] = useState<Table["section"] | "All">("All")
  const [filteredTables, setFilteredTables] = useState<Table[]>([])

  useEffect(() => {
    let filtered = tables

    // Filter by section
    if (activeSection !== "All") {
      filtered = filtered.filter((table) => table.section === activeSection)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (table) => table.number.toLowerCase().includes(query) || table.customer.toLowerCase().includes(query),
      )
    }

    // Only show available tables
    filtered = filtered.filter((table) => table.status === "Available" || table.status === "Occupied")

    setFilteredTables(filtered)
  }, [tables, searchQuery, activeSection])

  const handleTableClick = (table: Table) => {
    onTableSelect(table)
    onOpenChange(false)
  }

  const getTableStatusClass = (status: Table["status"]) => {
    switch (status) {
      case "Available":
        return "bg-green-100 border-green-200 text-green-800"
      case "Occupied":
        return "bg-amber-100 border-amber-200 text-amber-800"
      case "Reserved":
        return "bg-blue-100 border-blue-200 text-blue-800"
      default:
        return "bg-gray-100 border-gray-200 text-gray-800"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select a Table</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tables..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="All" onValueChange={(value) => setActiveSection(value as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="All">All Tables</TabsTrigger>
            <TabsTrigger value="Main">Main</TabsTrigger>
            <TabsTrigger value="Outdoor">Outdoor</TabsTrigger>
            <TabsTrigger value="Private">Private</TabsTrigger>
            <TabsTrigger value="Bar">Bar</TabsTrigger>
          </TabsList>

          <TabsContent value="All" className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto p-1">
              {filteredTables.map((table) => (
                <div
                  key={table.id}
                  className={`cursor-pointer border rounded-lg p-3 hover:shadow-md transition-shadow ${getTableStatusClass(
                    table.status,
                  )}`}
                  onClick={() => handleTableClick(table)}
                >
                  <div className="font-bold text-lg">Table {table.number}</div>
                  <div className="text-sm">{table.section}</div>
                  <div className="text-sm mt-1">
                    <span className="font-medium">Status:</span> {table.status}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Capacity:</span> {table.capacity}
                  </div>
                  {table.customer && <div className="text-sm mt-1">Customer: {table.customer}</div>}
                </div>
              ))}
            </div>
          </TabsContent>

          {["Main", "Outdoor", "Private", "Bar"].map((section) => (
            <TabsContent key={section} value={section} className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto p-1">
                {filteredTables
                  .filter((table) => table.section === section)
                  .map((table) => (
                    <div
                      key={table.id}
                      className={`cursor-pointer border rounded-lg p-3 hover:shadow-md transition-shadow ${getTableStatusClass(
                        table.status,
                      )}`}
                      onClick={() => handleTableClick(table)}
                    >
                      <div className="font-bold text-lg">Table {table.number}</div>
                      <div className="text-sm">{table.section}</div>
                      <div className="text-sm mt-1">
                        <span className="font-medium">Status:</span> {table.status}
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Capacity:</span> {table.capacity}
                      </div>
                      {table.customer && <div className="text-sm mt-1">Customer: {table.customer}</div>}
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

