"use client"

import type React from "react"

import { useState } from "react"
import { usePOS } from "@/context/pos-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { FinancialTransaction } from "@/lib/data"

interface TransactionFormProps {
  onClose: () => void
}

export function TransactionForm({ onClose }: TransactionFormProps) {
  const { createTransaction, currentUser } = usePOS()
  const { toast } = useToast()

  // Form state
  const [type, setType] = useState<FinancialTransaction["type"]>("Expense")
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState<FinancialTransaction["method"]>("Cash")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || Number.parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than zero",
        variant: "destructive",
      })
      return
    }

    try {
      await createTransaction({
        type,
        amount: Number.parseFloat(amount),
        method,
        description: description || undefined,
        category: category || undefined,
        staffId: currentUser?.id || "1", // Default to admin if no user logged in
      })

      toast({
        title: "Transaction created",
        description: `${type} transaction has been recorded successfully`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create transaction",
        variant: "destructive",
      })
    }
  }

  // Category options based on transaction type
  const getCategoryOptions = () => {
    switch (type) {
      case "Expense":
        return ["Inventory", "Maintenance", "Utilities", "Rent", "Salaries", "Marketing", "Equipment", "Other"]
      case "Sale":
        return ["Food", "Beverage", "Merchandise", "Service", "Other"]
      case "Refund":
        return ["Customer Complaint", "Order Error", "Product Quality", "Other"]
      case "Adjustment":
        return ["Inventory Adjustment", "Cash Adjustment", "Accounting Correction", "Other"]
      default:
        return []
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="type">Transaction Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as FinancialTransaction["type"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sale">Sale</SelectItem>
                <SelectItem value="Expense">Expense</SelectItem>
                <SelectItem value="Refund">Refund</SelectItem>
                <SelectItem value="Adjustment">Adjustment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select value={method} onValueChange={(value) => setMethod(value as FinancialTransaction["method"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Card">Credit/Debit Card</SelectItem>
                <SelectItem value="QR Code">QR Code</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {getCategoryOptions().map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter transaction description"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Transaction</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

