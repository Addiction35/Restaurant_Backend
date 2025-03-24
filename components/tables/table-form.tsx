"use client"

import type React from "react"

import { useState } from "react"
import { usePOS } from "@/context/pos-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Table } from "@/lib/data"

interface TableFormProps {
  onClose: () => void
}

export function TableForm({ onClose }: TableFormProps) {
  const { tables, updateTableStatus } = usePOS()
  const { toast } = useToast()

  const [tableNumber, setTableNumber] = useState("")
  const [capacity, setCapacity] = useState("4")
  const [section, setSection] = useState<Table["section"]>("Main")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate table number is unique
    if (tables.some((table) => table.number === tableNumber)) {
      toast({
        title: "Error",
        description: "Table number already exists",
        variant: "destructive",
      })
      return
    }

    try {
      // Create a new table ID
      const newTableId = Math.random().toString(36).substring(2, 9)

      // Create the new table
      const newTable: Table = {
        id: newTableId,
        number: tableNumber,
        customer: "",
        status: "Available",
        capacity: Number.parseInt(capacity),
        section,
      }

      // Add the table to the tables array
      tables.push(newTable)

      toast({
        title: "Table created",
        description: `Table ${tableNumber} has been created successfully`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create table",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Table</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="tableNumber">Table Number</Label>
            <Input
              id="tableNumber"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="Enter table number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="20"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">Section</Label>
            <Select value={section} onValueChange={(value) => setSection(value as Table["section"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Main">Main</SelectItem>
                <SelectItem value="Outdoor">Outdoor</SelectItem>
                <SelectItem value="Private">Private</SelectItem>
                <SelectItem value="Bar">Bar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Table</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

