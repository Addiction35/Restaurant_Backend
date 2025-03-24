"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserSettings } from "./user-settings"
import { RestaurantSettings } from "./restaurant-settings"
import { MenuSettings } from "./menu-settings"
import { SystemSettings } from "./system-settings"

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState("users")

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tabs defaultValue="users" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-0">
            <UserSettings />
          </TabsContent>

          <TabsContent value="restaurant" className="mt-0">
            <RestaurantSettings />
          </TabsContent>

          <TabsContent value="menu" className="mt-0">
            <MenuSettings />
          </TabsContent>

          <TabsContent value="system" className="mt-0">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

