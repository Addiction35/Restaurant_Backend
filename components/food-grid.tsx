"use client"

import { FoodCard } from "./food-card"
import { usePOS } from "@/context/pos-context"

export function FoodGrid() {
  const { filteredMenuItems } = usePOS()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredMenuItems.map((item) => (
        <FoodCard key={item.id} item={item} />
      ))}
    </div>
  )
}

