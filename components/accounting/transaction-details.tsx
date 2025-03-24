"use client"

import { usePOS } from "@/context/pos-context"
import type { FinancialTransaction, Order } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { X, DollarSign, Calendar, User, ShoppingBag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"

interface TransactionDetailsProps {
  transaction: FinancialTransaction
  onClose: () => void
}

export function TransactionDetails({ transaction, onClose }: TransactionDetailsProps) {
  const { orders, users } = usePOS()
  const [relatedOrder, setRelatedOrder] = useState<Order | null>(null)
  const [staffMember, setStaffMember] = useState<string>("Unknown")

  useEffect(() => {
    // Find related order if exists
    if (transaction.orderId) {
      const order = orders.find((o) => o.id === transaction.orderId)
      setRelatedOrder(order || null)
    }

    // Find staff member
    const staff = users.find((u) => u.id === transaction.staffId)
    if (staff) {
      setStaffMember(staff.name)
    }
  }, [transaction, orders, users])

  const getTypeColor = (type: FinancialTransaction["type"]) => {
    switch (type) {
      case "Sale":
        return "bg-green-100 text-green-800"
      case "Refund":
        return "bg-red-100 text-red-800"
      case "Expense":
        return "bg-orange-100 text-orange-800"
      case "Adjustment":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">Transaction Details</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold">
              {transaction.description || `Transaction #${transaction.id.substring(0, 6)}`}
            </h3>
            <Badge variant="outline" className={getTypeColor(transaction.type)}>
              {transaction.type}
            </Badge>
          </div>
          <div
            className={`text-xl font-bold ${transaction.type === "Sale" ? "text-green-600" : transaction.type === "Refund" || transaction.type === "Expense" ? "text-red-600" : ""}`}
          >
            {transaction.type === "Refund" || transaction.type === "Expense" ? "-" : ""}${transaction.amount.toFixed(2)}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-3 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Date & Time</div>
              <div>{new Date(transaction.timestamp).toLocaleString()}</div>
            </div>
          </div>

          <div className="flex items-center">
            <DollarSign className="h-5 w-5 mr-3 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Payment Method</div>
              <div>{transaction.method}</div>
            </div>
          </div>

          <div className="flex items-center">
            <User className="h-5 w-5 mr-3 text-gray-500" />
            <div>
              <div className="text-sm text-gray-500">Staff Member</div>
              <div>{staffMember}</div>
            </div>
          </div>

          {transaction.category && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm font-medium">Category:</div>
              <div>{transaction.category}</div>
            </div>
          )}
        </div>

        {relatedOrder && (
          <>
            <Separator className="my-4" />

            <div className="mb-6">
              <h3 className="font-medium mb-2">Related Order</h3>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <ShoppingBag className="h-5 w-5 mr-2 text-blue-600" />
                  <div>
                    <div className="font-medium">Order #{relatedOrder.id.substring(0, 6)}</div>
                    <div className="text-sm">
                      {relatedOrder.items} items • ${relatedOrder.total.toFixed(2)}
                    </div>
                    <div className="text-sm">{new Date(relatedOrder.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {transaction.description && (
          <>
            <Separator className="my-4" />

            <div className="mb-6">
              <h3 className="font-medium mb-2">Description</h3>
              <div className="bg-gray-50 p-3 rounded-lg">{transaction.description}</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

