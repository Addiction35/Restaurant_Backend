"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, MapPin, Clock, Palette, CheckCircle2 } from "lucide-react"

export function RestaurantSettings() {
  const { toast } = useToast()

  // Restaurant info state
  const [restaurantName, setRestaurantName] = useState("Chili Restaurant")
  const [address, setAddress] = useState("123 Main Street, Anytown, USA")
  const [phone, setPhone] = useState("(555) 123-4567")
  const [email, setEmail] = useState("info@chilirestaurant.com")
  const [website, setWebsite] = useState("www.chilirestaurant.com")
  const [taxRate, setTaxRate] = useState("5")

  // Business hours state
  const [businessHours, setBusinessHours] = useState({
    monday: { open: "09:00", close: "22:00", closed: false },
    tuesday: { open: "09:00", close: "22:00", closed: false },
    wednesday: { open: "09:00", close: "22:00", closed: false },
    thursday: { open: "09:00", close: "22:00", closed: false },
    friday: { open: "09:00", close: "23:00", closed: false },
    saturday: { open: "10:00", close: "23:00", closed: false },
    sunday: { open: "10:00", close: "21:00", closed: false },
  })

  // Table layout state
  const [tableLayout, setTableLayout] = useState({
    mainSection: true,
    outdoorSection: true,
    privateSection: true,
    barSection: true,
  })

  const handleSaveInfo = () => {
    toast({
      title: "Settings saved",
      description: "Restaurant information has been updated",
      action: (
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        </div>
      ),
    })
  }

  const handleSaveHours = () => {
    toast({
      title: "Hours saved",
      description: "Business hours have been updated",
      action: (
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        </div>
      ),
    })
  }

  const handleSaveTables = () => {
    toast({
      title: "Table layout saved",
      description: "Table layout settings have been updated",
      action: (
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        </div>
      ),
    })
  }

  const handleSaveBranding = () => {
    toast({
      title: "Branding saved",
      description: "Branding settings have been updated",
      action: (
        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
        </div>
      ),
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="info">Restaurant Info</TabsTrigger>
          <TabsTrigger value="hours">Business Hours</TabsTrigger>
          <TabsTrigger value="tables">Table Layout</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>Basic information about your restaurant</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="restaurantName">Restaurant Name</Label>
                  <Input
                    id="restaurantName"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
                  <div className="flex justify-end">
                    <Button type="button" variant="outline" size="sm" className="mt-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      Set on Map
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Restaurant Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Enter a brief description of your restaurant, cuisine type, and special features"
                    defaultValue="Chili Restaurant offers a diverse menu of international cuisine with a focus on fresh, locally-sourced ingredients. Our comfortable atmosphere makes us perfect for casual dining and special occasions alike."
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveInfo}>Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your restaurant's operating hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                {Object.entries(businessHours).map(([day, hours]) => (
                  <div key={day} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3 font-medium capitalize">{day}</div>

                    <div className="col-span-8 grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`${day}-open`} className="sr-only">
                          Opening Time
                        </Label>
                        <Input
                          id={`${day}-open`}
                          type="time"
                          value={hours.open}
                          onChange={(e) =>
                            setBusinessHours({
                              ...businessHours,
                              [day]: { ...hours, open: e.target.value },
                            })
                          }
                          disabled={hours.closed}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`${day}-close`} className="sr-only">
                          Closing Time
                        </Label>
                        <Input
                          id={`${day}-close`}
                          type="time"
                          value={hours.close}
                          onChange={(e) =>
                            setBusinessHours({
                              ...businessHours,
                              [day]: { ...hours, close: e.target.value },
                            })
                          }
                          disabled={hours.closed}
                        />
                      </div>
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <Switch
                        id={`${day}-closed`}
                        checked={hours.closed}
                        onCheckedChange={(checked) =>
                          setBusinessHours({
                            ...businessHours,
                            [day]: { ...hours, closed: checked },
                          })
                        }
                      />
                      <Label htmlFor={`${day}-closed`} className="ml-2 text-sm">
                        Closed
                      </Label>
                    </div>
                  </div>
                ))}

                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between border-t pt-4">
                    <div>
                      <Label className="text-base">Special Holiday Hours</Label>
                      <p className="text-sm text-gray-500">Configure special hours for holidays</p>
                    </div>
                    <Button type="button" variant="outline">
                      <Clock className="h-4 w-4 mr-2" />
                      Set Holiday Hours
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveHours}>Save Hours</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tables" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Table Layout Settings</CardTitle>
              <CardDescription>Configure table sections and layout options</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-4">
                  <h3 className="font-medium">Active Sections</h3>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="mainSection">Main Dining Area</Label>
                    <Switch
                      id="mainSection"
                      checked={tableLayout.mainSection}
                      onCheckedChange={(checked) =>
                        setTableLayout({
                          ...tableLayout,
                          mainSection: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="outdoorSection">Outdoor Patio</Label>
                    <Switch
                      id="outdoorSection"
                      checked={tableLayout.outdoorSection}
                      onCheckedChange={(checked) =>
                        setTableLayout({
                          ...tableLayout,
                          outdoorSection: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="privateSection">Private Dining Rooms</Label>
                    <Switch
                      id="privateSection"
                      checked={tableLayout.privateSection}
                      onCheckedChange={(checked) =>
                        setTableLayout({
                          ...tableLayout,
                          privateSection: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="barSection">Bar Seating</Label>
                    <Switch
                      id="barSection"
                      checked={tableLayout.barSection}
                      onCheckedChange={(checked) =>
                        setTableLayout({
                          ...tableLayout,
                          barSection: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="border-t pt-4 space-y-4">
                  <h3 className="font-medium">Table Configuration</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tablePrefix">Table Number Prefix</Label>
                      <Input id="tablePrefix" defaultValue="T" placeholder="T" />
                      <p className="text-xs text-gray-500">Displayed before table numbers (e.g., T1, T2)</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxCapacity">Default Max Capacity</Label>
                      <Input id="maxCapacity" type="number" min="1" defaultValue="4" />
                      <p className="text-xs text-gray-500">Default seating capacity for new tables</p>
                    </div>
                  </div>

                  <Button type="button" variant="outline">
                    Configure Table Layout
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveTables}>Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize your restaurant's visual identity</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <div className="flex items-center gap-4">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg"
                      alt="Restaurant Logo"
                      className="w-24 h-24 object-contain border rounded-md"
                    />
                    <div className="space-y-2">
                      <Button variant="outline" type="button">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New Logo
                      </Button>
                      <p className="text-xs text-gray-500">Recommended size: 512×512px. PNG or JPG.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" id="primaryColor" value="#10b981" className="w-12 h-10 p-1" />
                      <Input value="#10b981" className="w-32" />
                    </div>
                    <p className="text-xs text-gray-500">Used for buttons, links and highlights</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input type="color" id="secondaryColor" value="#6366f1" className="w-12 h-10 p-1" />
                      <Input value="#6366f1" className="w-32" />
                    </div>
                    <p className="text-xs text-gray-500">Used for accents and secondary elements</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Color Theme</Label>
                  <Select defaultValue="light">
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System Preference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiptHeader">Receipt Header</Label>
                  <Textarea
                    id="receiptHeader"
                    placeholder="Text to appear at the top of receipts"
                    rows={2}
                    defaultValue="Thank you for dining at Chili Restaurant!"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiptFooter">Receipt Footer</Label>
                  <Textarea
                    id="receiptFooter"
                    placeholder="Text to appear at the bottom of receipts"
                    rows={2}
                    defaultValue="Please come again! www.chilirestaurant.com"
                  />
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2" type="button">
                    <Palette className="h-4 w-4 mr-2" />
                    Preview Theme
                  </Button>
                  <Button onClick={handleSaveBranding}>Save Branding</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

