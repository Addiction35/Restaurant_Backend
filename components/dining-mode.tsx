"use client"

import { Button } from "@/components/ui/button"
import { usePOS } from "@/context/pos-context"

const modes = ["Dine in", "Take Away", "Delivery"] as const

export function DiningMode() {
  const { diningMode, setDiningMode } = usePOS()

  return (
    <div className="flex gap-2 mb-4">
      {modes.map((mode) => (
        <Button
          key={mode}
          variant={mode === diningMode ? "secondary" : "ghost"}
          className="rounded-full"
          onClick={() => setDiningMode(mode)}
        >
          {mode}
        </Button>
      ))}
    </div>
  )
}

