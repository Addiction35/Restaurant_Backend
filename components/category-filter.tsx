"use client"

import { Grid, Coffee, Soup, UtensilsCrossed, ChefHat, Sandwich } from "lucide-react"
import { usePOS } from "@/context/pos-context"

// Map category icons to Lucide components
const iconMap: Record<string, any> = {
  Grid: Grid,
  Coffee: Coffee,
  Soup: Soup,
  UtensilsCrossed: UtensilsCrossed,
  ChefHat: ChefHat,
  Sandwich: Sandwich,
}

export function CategoryFilter() {
  const { categories, activeCategory, setActiveCategory } = usePOS()

  return (
    <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
      {categories.map((category) => {
        const IconComponent = iconMap[category.icon]
        return (
          <div
            key={category.id}
            className={`flex flex-col items-center p-3 rounded-xl min-w-[100px] ${
              category.id === activeCategory ? "bg-green-50 text-green-600" : "bg-white"
            } border cursor-pointer hover:bg-green-50`}
            onClick={() => setActiveCategory(category.id)}
          >
            {IconComponent && <IconComponent className="h-6 w-6 mb-1" />}
            <span className="text-sm font-medium">{category.label}</span>
            <span className="text-xs text-gray-500">{category.items} Items</span>
          </div>
        )
      })}
    </div>
  )
}

