"use client"

import type React from "react"

import { useState } from "react"
import { usePOS } from "@/context/pos-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import type { User } from "@/lib/data"

interface UserFormProps {
  onClose: () => void
  existingUser?: User | null
  onSave: (user: User) => void
}

export function UserForm({ onClose, existingUser, onSave }: UserFormProps) {
  const { toast } = useToast()
  const { api } = usePOS()

  // Form state
  const [name, setName] = useState(existingUser?.name || "")
  const [email, setEmail] = useState(existingUser?.email || "")
  const [role, setRole] = useState<User["role"]>(existingUser?.role || "Server")
  const [pin, setPin] = useState(existingUser?.pin || "")
  const [confirmPin, setConfirmPin] = useState(existingUser?.pin || "")
  const [active, setActive] = useState(existingUser?.active !== false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!name.trim()) errors.name = "Name is required"
    if (!email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email is invalid"

    if (!pin.trim()) errors.pin = "PIN is required"
    else if (!/^\d{4}$/.test(pin)) errors.pin = "PIN must be 4 digits"

    if (pin !== confirmPin) errors.confirmPin = "PINs do not match"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      // Prepare user data
      const userData: User = {
        id: existingUser?.id || `user-${Date.now()}`,
        name,
        email,
        role,
        pin,
        active,
      }

      if (existingUser) {
        // Update existing user
        // In a real app, this would call an API
        onSave(userData)
      } else {
        // Create new user
        // In a real app, this would call an API
        onSave(userData)
      }

      toast({
        title: existingUser ? "User updated" : "User created",
        description: `${name} has been ${existingUser ? "updated" : "added"} successfully`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: existingUser ? "Failed to update user" : "Failed to create user",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{existingUser ? "Edit User" : "Add New User"}</DialogTitle>
          <DialogDescription>
            {existingUser
              ? "Update user details and permissions."
              : "Create a new user account with appropriate role and permissions."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter full name"
              className={formErrors.name ? "border-red-500" : ""}
            />
            {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className={formErrors.email ? "border-red-500" : ""}
            />
            {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value) => setRole(value as User["role"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Server">Server</SelectItem>
                <SelectItem value="Kitchen">Kitchen</SelectItem>
                <SelectItem value="Cashier">Cashier</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {role === "Admin" && "Full access to all system features and settings"}
              {role === "Manager" && "Access to most features except system settings"}
              {role === "Server" && "Access to ordering and table management"}
              {role === "Kitchen" && "Access to kitchen display and order management"}
              {role === "Cashier" && "Access to payment processing and receipts"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pin">PIN Code</Label>
              <Input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="4-digit PIN"
                maxLength={4}
                pattern="[0-9]{4}"
                className={formErrors.pin ? "border-red-500" : ""}
              />
              {formErrors.pin && <p className="text-xs text-red-500">{formErrors.pin}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPin">Confirm PIN</Label>
              <Input
                id="confirmPin"
                type="password"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="Confirm PIN"
                maxLength={4}
                pattern="[0-9]{4}"
                className={formErrors.confirmPin ? "border-red-500" : ""}
              />
              {formErrors.confirmPin && <p className="text-xs text-red-500">{formErrors.confirmPin}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="active" className="text-base">
                Active Status
              </Label>
              <p className="text-xs text-gray-500">Inactive users cannot log in</p>
            </div>
            <Switch id="active" checked={active} onCheckedChange={setActive} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{existingUser ? "Update User" : "Add User"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

