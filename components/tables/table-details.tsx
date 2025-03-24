"use client"

import { useState, useEffect } from "react"
import { usePOS } from "@/context/pos-context"
import type { Table, Order } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Edit2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

interface TableDetailsProps {
  table: Table
  onClose: () => void
}

export function TableDetails({ table, onClose }: TableDetailsProps) {
  const { orders, updateTableStatus, setActiveTable } = usePOS()
  const [tableOrders, setTableOrders] = useState<Order[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [customerName, setCustomerName] = useState(table.customer)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Find orders for this table
    const filteredOrders = orders.filter((order) => order.tableId === table.id)
    setTableOrders(filteredOrders)
  }, [table.id, orders])

  const handleUpdateStatus = async (status: Table["status"]) => {
    try {
      await updateTableStatus(table.id, status, customerName)
      toast({
        title: "Table updated",
        description: `Table ${table.number} status changed to ${status}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update table status",
        variant: "destructive",
      })
    }
  }

  const handleSaveCustomer = async () => {
    try {
      await updateTableStatus(table.id, table.status, customerName)
      setIsEditing(false)
      toast({
        title: "Customer updated",
        description: `Customer name updated for Table ${table.number}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer name",
        variant: "destructive",
      })
    }
  }

  const handleCreateOrder = () => {
    setActiveTable(table)
    router.push("/menu")
  }

  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800"
      case "Occupied":
        return "bg-red-100 text-red-800"
      case "Reserved":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Table {table.number}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        <div className="mb-4">
          <Badge variant="outline" className={getStatusColor(table.status)}>
            {table.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-gray-500" />
            <span>Capacity: {table.capacity}</span>
          </div>
          <div>
            <span className="text-gray-500">Section: {table.section}</span>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <Label>Customer</Label>
            {!isEditing && (
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {isEditing ? (
            <div className="flex gap-2">
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
              <Button size="sm" onClick={handleSaveCustomer}>
                Save
              </Button>
            </div>
          ) : (
            <p className="text-lg">{table.customer || "No customer assigned"}</p>
          )}
        </div>

        <Separator className="my-4" />

        <div className="mb-6">
          <h3 className="font-medium mb-2">Table Actions</h3>
          <div className="flex flex-wrap gap-2">
            {table.status === "Available" && (
              <>
                <Button onClick={() => handleUpdateStatus("Occupied")}>Set as Occupied</Button>
                <Button variant="outline" onClick={() => handleUpdateStatus("Reserved")}>
                  Set as Reserved
                </Button>
              </>
            )}

            {table.status === "Occupied" && (
              <Button onClick={() => handleUpdateStatus("Available")}>Set as Available</Button>
            )}

            {table.status === "Reserved" && (
              <>
                <Button onClick={() => handleUpdateStatus("Occupied")}>Set as Occupied</Button>
                <Button variant="outline" onClick={() => handleUpdateStatus("Available")}>
                  Set as Available
                </Button>
              </>
            )}

            <Button variant="secondary" onClick={handleCreateOrder} disabled={table.status === "Reserved"}>
              Create Order
            </Button>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <h3 className="font-medium mb-2">Recent Orders</h3>
          {tableOrders.length === 0 ? (
            <p className="text-gray-500">No orders for this table</p>
          ) : (
            <div className="space-y-3">
              {tableOrders.map((order) => (
                <div key={order.id} className="border rounded-lg p-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Order #{order.id.substring(0, 6)}</span>
                    <Badge
                      variant="outline"
                      className={
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{new Date(order.timestamp).toLocaleString()}</div>
                  <div className="mt-2">
                    <span className="text-sm">{order.items} items</span>
                    <span className="text-sm font-medium ml-4">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

