"use client"

import { useState, useEffect } from "react"
import { usePOS } from "@/context/pos-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Calendar } from "lucide-react"
import type { FinancialTransaction } from "@/lib/data"
import { TransactionList } from "./transaction-list"
import { TransactionDetails } from "./transaction-details"
import { TransactionForm } from "./transaction-form"
import { SalesReport } from "./sales-report"
import { ExpenseReport } from "./expense-report"

export function AccountingContent() {
  const { transactions } = usePOS()
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)
  const [activeType, setActiveType] = useState<FinancialTransaction["type"] | "All">("All")
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 days ago
    endDate: new Date().toISOString().split("T")[0], // today
  })

  useEffect(() => {
    let filtered = transactions

    // Filter by type
    if (activeType !== "All") {
      filtered = filtered.filter((transaction) => transaction.type === activeType)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (transaction) =>
          (transaction.description && transaction.description.toLowerCase().includes(query)) ||
          transaction.id.toLowerCase().includes(query) ||
          (transaction.orderId && transaction.orderId.toLowerCase().includes(query)),
      )
    }

    // Filter by date range
    const startDate = new Date(dateRange.startDate).getTime()
    const endDate = new Date(dateRange.endDate).getTime() + 86400000 // Add one day to include the end date

    filtered = filtered.filter((transaction) => {
      const txDate = new Date(transaction.timestamp).getTime()
      return txDate >= startDate && txDate <= endDate
    })

    setFilteredTransactions(filtered)
  }, [transactions, searchQuery, activeType, dateRange])

  const handleTransactionClick = (transaction: FinancialTransaction) => {
    setSelectedTransaction(transaction)
  }

  const handleCloseDetails = () => {
    setSelectedTransaction(null)
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Accounting</h1>
          <Button onClick={() => setShowTransactionForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search transactions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <Calendar className="h-4 w-4 text-gray-500" />
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="w-auto"
            />
            <span>to</span>
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="w-auto"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="sales">Sales Report</TabsTrigger>
              <TabsTrigger value="expenses">Expense Report</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="mt-0">
              <Tabs defaultValue="All" onValueChange={(value) => setActiveType(value as any)}>
                <TabsList className="mb-4">
                  <TabsTrigger value="All">All</TabsTrigger>
                  <TabsTrigger value="Sale">Sales</TabsTrigger>
                  <TabsTrigger value="Expense">Expenses</TabsTrigger>
                  <TabsTrigger value="Refund">Refunds</TabsTrigger>
                  <TabsTrigger value="Adjustment">Adjustments</TabsTrigger>
                </TabsList>

                <TabsContent value="All" className="mt-0">
                  <TransactionList transactions={filteredTransactions} onTransactionClick={handleTransactionClick} />
                </TabsContent>

                {["Sale", "Expense", "Refund", "Adjustment"].map((type) => (
                  <TabsContent key={type} value={type} className="mt-0">
                    <TransactionList
                      transactions={filteredTransactions.filter((t) => t.type === type)}
                      onTransactionClick={handleTransactionClick}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>

            <TabsContent value="sales" className="mt-0">
              <SalesReport transactions={transactions} dateRange={dateRange} />
            </TabsContent>

            <TabsContent value="expenses" className="mt-0">
              <ExpenseReport transactions={transactions} dateRange={dateRange} />
            </TabsContent>
          </Tabs>
        </div>

        {selectedTransaction && (
          <div className="w-[400px] border-l bg-white overflow-auto">
            <TransactionDetails transaction={selectedTransaction} onClose={handleCloseDetails} />
          </div>
        )}
      </div>

      {showTransactionForm && <TransactionForm onClose={() => setShowTransactionForm(false)} />}
    </div>
  )
}

