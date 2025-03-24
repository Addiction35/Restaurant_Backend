import type { FinancialTransaction } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface RecentTransactionsProps {
  transactions: FinancialTransaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No recent transactions found</div>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <div className="font-medium">{transaction.description || `Transaction #${transaction.id}`}</div>
                  <div className="text-sm text-gray-500">{new Date(transaction.timestamp).toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-medium ${transaction.type === "Sale" ? "text-green-600" : transaction.type === "Refund" || transaction.type === "Expense" ? "text-red-600" : ""}`}
                  >
                    {transaction.type === "Refund" || transaction.type === "Expense" ? "-" : ""}$
                    {transaction.amount.toFixed(2)}
                  </div>
                  <div className="flex gap-2 mt-1 justify-end">
                    <Badge variant="outline" className={getTypeColor(transaction.type)}>
                      {transaction.type}
                    </Badge>
                    <Badge variant="outline">{transaction.method}</Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

