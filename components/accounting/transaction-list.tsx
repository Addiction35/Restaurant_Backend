"use client"

import type { FinancialTransaction } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TransactionListProps {
  transactions: FinancialTransaction[]
  onTransactionClick: (transaction: FinancialTransaction) => void
}

export function TransactionList({ transactions, onTransactionClick }: TransactionListProps) {
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

  const getMethodColor = (method: FinancialTransaction["method"]) => {
    switch (method) {
      case "Cash":
        return "bg-yellow-100 text-yellow-800"
      case "Card":
        return "bg-purple-100 text-purple-800"
      case "QR Code":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No transactions found</div>
      ) : (
        transactions.map((transaction) => (
          <Card
            key={transaction.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onTransactionClick(transaction)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">
                    {transaction.description || `Transaction #${transaction.id.substring(0, 6)}`}
                  </h3>
                  <div className="text-sm text-gray-500 mt-1">{new Date(transaction.timestamp).toLocaleString()}</div>
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`font-bold ${transaction.type === "Sale" ? "text-green-600" : transaction.type === "Refund" || transaction.type === "Expense" ? "text-red-600" : ""}`}
                  >
                    {transaction.type === "Refund" || transaction.type === "Expense" ? "-" : ""}$
                    {transaction.amount.toFixed(2)}
                  </span>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className={getTypeColor(transaction.type)}>
                      {transaction.type}
                    </Badge>
                    <Badge variant="outline" className={getMethodColor(transaction.method)}>
                      {transaction.method}
                    </Badge>
                  </div>
                </div>
              </div>

              {transaction.orderId && <div className="mt-2 text-sm">Order: #{transaction.orderId.substring(0, 6)}</div>}

              {transaction.category && (
                <div className="mt-1 text-sm text-gray-500">Category: {transaction.category}</div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}

