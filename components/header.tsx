"use client"

import type React from "react"

import { Search, Share2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePOS } from "@/context/pos-context"
import { useState } from "react"

export function Header() {
  const { activeTable, searchMenuItems } = usePOS()
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    searchMenuItems(value)
  }

  return (
    <div className="bg-white p-4 flex items-center gap-4 border-b">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search Product here..."
          className="pl-10 w-full"
          value={searchValue}
          onChange={handleSearch}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold">Table {activeTable?.number || "-"}</span>
        <span className="text-gray-500 text-sm">{activeTable?.customer || "-"}</span>
      </div>
      <Button variant="ghost" size="icon">
        <Share2 className="h-5 w-5" />
      </Button>
    </div>
  )
}

