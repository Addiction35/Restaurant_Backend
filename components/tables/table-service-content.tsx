"use client"

import { useState, useEffect } from "react"
import { usePOS } from "@/context/pos-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TableGrid } from "./table-grid"
import { TableDetails } from "./table-details"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus } from "lucide-react"
import type { Table } from "@/lib/data"
import { TableForm } from "./table-form"

export function TableServiceContent() {
  const { tables } = usePOS()
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTables, setFilteredTables] = useState(tables)
  const [activeSection, setActiveSection] = useState<Table["section"] | "All">("All")
  const [showTableForm, setShowTableForm] = useState(false)

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

    setFilteredTables(filtered)
  }, [tables, searchQuery, activeSection])

  const handleTableClick = (table: Table) => {
    setSelectedTable(table)
  }

  const handleCloseDetails = () => {
    setSelectedTable(null)
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Table Services</h1>
          <Button onClick={() => setShowTableForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Table
          </Button>
        </div>
        <div className="flex gap-4">
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
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="All" className="w-full" onValueChange={(value) => setActiveSection(value as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="All">All Tables</TabsTrigger>
              <TabsTrigger value="Main">Main</TabsTrigger>
              <TabsTrigger value="Outdoor">Outdoor</TabsTrigger>
              <TabsTrigger value="Private">Private</TabsTrigger>
              <TabsTrigger value="Bar">Bar</TabsTrigger>
            </TabsList>

            <TabsContent value="All" className="mt-0">
              <TableGrid tables={filteredTables} onTableClick={handleTableClick} />
            </TabsContent>

            <TabsContent value="Main" className="mt-0">
              <TableGrid
                tables={filteredTables.filter((table) => table.section === "Main")}
                onTableClick={handleTableClick}
              />
            </TabsContent>

            <TabsContent value="Outdoor" className="mt-0">
              <TableGrid
                tables={filteredTables.filter((table) => table.section === "Outdoor")}
                onTableClick={handleTableClick}
              />
            </TabsContent>

            <TabsContent value="Private" className="mt-0">
              <TableGrid
                tables={filteredTables.filter((table) => table.section === "Private")}
                onTableClick={handleTableClick}
              />
            </TabsContent>

            <TabsContent value="Bar" className="mt-0">
              <TableGrid
                tables={filteredTables.filter((table) => table.section === "Bar")}
                onTableClick={handleTableClick}
              />
            </TabsContent>
          </Tabs>
        </div>

        {selectedTable && (
          <div className="w-[400px] border-l bg-white overflow-auto">
            <TableDetails table={selectedTable} onClose={handleCloseDetails} />
          </div>
        )}
      </div>

      {showTableForm && <TableForm onClose={() => setShowTableForm(false)} />}
    </div>
  )
}

