"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DownloadCloud, Upload, Shield, Key } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export function SystemSettings() {
  const { toast } = useToast()

  // General settings
  const [currency, setCurrency] = useState("USD")
  const [language, setLanguage] = useState("en")
  const [timeFormat, setTimeFormat] = useState("12h")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")

  // Receipt settings
  const [printReceipt, setPrintReceipt] = useState(true)
  const [emailReceipt, setEmailReceipt] = useState(false)
  const [receiptSize, setReceiptSize] = useState("80mm")
  const [includeTips, setIncludeTips] = useState(true)

  // Notification settings
  const [lowStockAlert, setLowStockAlert] = useState(true)
  const [lowStockThreshold, setLowStockThreshold] = useState("10")
  const [orderNotifications, setOrderNotifications] = useState(true)
  const [reservationNotifications, setReservationNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  // Backup settings
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [backupTime, setBackupTime] = useState("02:00")
  const [backupCloud, setBackupCloud] = useState(true)
  const [backupRetention, setBackupRetention] = useState("7")

  // Security settings
  const [requirePin, setRequirePin] = useState(true)
  const [pinTimeout, setPinTimeout] = useState("30")
  const [allowRemoteAccess, setAllowRemoteAccess] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)

  // Mock backup state
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)

  const handleSaveGeneral = () => {
    toast({
      title: "Settings saved",
      description: "General settings have been updated",
    })
  }

  const handleSaveReceipt = () => {
    toast({
      title: "Settings saved",
      description: "Receipt settings have been updated",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Settings saved",
      description: "Notification settings have been updated",
    })
  }

  const handleSaveBackup = () => {
    toast({
      title: "Settings saved",
      description: "Backup settings have been updated",
    })
  }

  const handleSaveSecurity = () => {
    toast({
      title: "Settings saved",
      description: "Security settings have been updated",
    })
  }

  const handleBackupNow = () => {
    setIsBackingUp(true)
    setBackupProgress(0)

    // Simulate backup process
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)

          toast({
            title: "Backup completed",
            description: "Your data has been backed up successfully",
          })

          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="receipts">Receipts</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure system-wide settings for your restaurant</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                        <SelectItem value="AUD">AUD ($)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select value={timeFormat} onValueChange={setTimeFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select value={dateFormat} onValueChange={setDateFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        <SelectItem value="MMM DD, YYYY">MMM DD, YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tablePrefix">Table Number Prefix</Label>
                  <div className="flex items-center gap-2">
                    <Input id="tablePrefix" placeholder="T" className="w-20" defaultValue="T" />
                    <span className="text-gray-500">+ Table Number (e.g., T1, T2)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="orderNumberPrefix">Order Number Prefix</Label>
                  <div className="flex items-center gap-2">
                    <Input id="orderNumberPrefix" placeholder="ORD" className="w-24" defaultValue="ORD" />
                    <span className="text-gray-500">+ Sequential Number (e.g., ORD0001)</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveGeneral}>Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="receipts" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Receipt Settings</CardTitle>
              <CardDescription>Configure how receipts are generated and printed</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="printReceipt" className="text-base">
                      Automatically Print Receipt
                    </Label>
                    <p className="text-sm text-gray-500">Print receipt when order is completed</p>
                  </div>
                  <Switch id="printReceipt" checked={printReceipt} onCheckedChange={setPrintReceipt} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailReceipt" className="text-base">
                      Email Receipt Option
                    </Label>
                    <p className="text-sm text-gray-500">Allow customers to receive digital receipts</p>
                  </div>
                  <Switch id="emailReceipt" checked={emailReceipt} onCheckedChange={setEmailReceipt} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiptSize">Receipt Paper Size</Label>
                  <Select value={receiptSize} onValueChange={setReceiptSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select receipt size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="58mm">58mm</SelectItem>
                      <SelectItem value="80mm">80mm</SelectItem>
                      <SelectItem value="A4">A4 Paper</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="includeTips" className="text-base">
                      Include Tips Option
                    </Label>
                    <p className="text-sm text-gray-500">Show tip options on receipts</p>
                  </div>
                  <Switch id="includeTips" checked={includeTips} onCheckedChange={setIncludeTips} />
                </div>

                <div className="space-y-2 pt-2">
                  <Label>Tip Presets (%)</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <Input defaultValue="10" className="text-center" />
                    <Input defaultValue="15" className="text-center" />
                    <Input defaultValue="18" className="text-center" />
                    <Input defaultValue="20" className="text-center" />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="receiptFooter">Receipt Footer Text</Label>
                  <Input
                    id="receiptFooter"
                    placeholder="Thank you for dining with us!"
                    defaultValue="Thank you for dining with us! Please come again."
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="button" variant="outline" className="mr-2">
                    Preview Receipt
                  </Button>
                  <Button onClick={handleSaveReceipt}>Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Inventory Alerts</h3>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="lowStockAlert">Low Stock Alerts</Label>
                      <Switch id="lowStockAlert" checked={lowStockAlert} onCheckedChange={setLowStockAlert} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        min="1"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                        disabled={!lowStockAlert}
                      />
                      <p className="text-xs text-gray-500">Alert when item quantity falls below this number</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Order Notifications</h3>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="orderNotifications">New Order Notifications</Label>
                      <Switch
                        id="orderNotifications"
                        checked={orderNotifications}
                        onCheckedChange={setOrderNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="reservationNotifications">Reservation Notifications</Label>
                      <Switch
                        id="reservationNotifications"
                        checked={reservationNotifications}
                        onCheckedChange={setReservationNotifications}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-4">Notification Channels</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications" className="text-base">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-gray-500">Send notifications to staff email addresses</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsNotifications" className="text-base">
                          SMS Notifications
                        </Label>
                        <p className="text-sm text-gray-500">Send notifications via text message</p>
                      </div>
                      <Switch id="smsNotifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                    </div>

                    {smsNotifications && (
                      <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                        <Label htmlFor="smsProvider">SMS Provider</Label>
                        <Select defaultValue="twilio">
                          <SelectTrigger>
                            <SelectValue placeholder="Select SMS provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="twilio">Twilio</SelectItem>
                            <SelectItem value="messagebird">MessageBird</SelectItem>
                            <SelectItem value="vonage">Vonage</SelectItem>
                          </SelectContent>
                        </Select>

                        <div className="pt-2 space-y-2">
                          <Label htmlFor="apiKey">API Key</Label>
                          <Input id="apiKey" type="password" placeholder="Enter API key" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" variant="outline" className="mr-2">
                    Test Notifications
                  </Button>
                  <Button onClick={handleSaveNotifications}>Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Manage data backups and system restoration</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBackup" className="text-base">
                      Automatic Backups
                    </Label>
                    <p className="text-sm text-gray-500">Schedule regular backups of your data</p>
                  </div>
                  <Switch id="autoBackup" checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Backup Frequency</Label>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency} disabled={!autoBackup}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backupTime">Backup Time</Label>
                    <Input
                      id="backupTime"
                      type="time"
                      value={backupTime}
                      onChange={(e) => setBackupTime(e.target.value)}
                      disabled={!autoBackup}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="backupCloud" className="text-base">
                      Cloud Backup Storage
                    </Label>
                    <p className="text-sm text-gray-500">Store backups in secure cloud storage</p>
                  </div>
                  <Switch
                    id="backupCloud"
                    checked={backupCloud}
                    onCheckedChange={setBackupCloud}
                    disabled={!autoBackup}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                  <Input
                    id="backupRetention"
                    type="number"
                    min="1"
                    value={backupRetention}
                    onChange={(e) => setBackupRetention(e.target.value)}
                    disabled={!autoBackup}
                  />
                  <p className="text-xs text-gray-500">Number of days to keep backups before automatic deletion</p>
                </div>

                {isBackingUp && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Backup in progress...</span>
                      <span>{backupProgress}%</span>
                    </div>
                    <Progress value={backupProgress} />
                  </div>
                )}

                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border border-dashed">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                        <DownloadCloud className="h-8 w-8 mx-auto text-primary" />
                        <h3 className="font-medium">Manual Backup</h3>
                        <p className="text-sm text-gray-500">Create a backup of your system data right now</p>
                        <Button variant="outline" className="w-full" onClick={handleBackupNow} disabled={isBackingUp}>
                          {isBackingUp ? "Backing up..." : "Backup Now"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-dashed">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                        <Upload className="h-8 w-8 mx-auto text-primary" />
                        <h3 className="font-medium">Restore System</h3>
                        <p className="text-sm text-gray-500">Restore your system from a previous backup</p>
                        <Button variant="outline" className="w-full">
                          Restore from Backup
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveBackup}>Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security options for your POS system</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requirePin" className="text-base">
                      Require PIN for Login
                    </Label>
                    <p className="text-sm text-gray-500">Users must enter PIN code to access system</p>
                  </div>
                  <Switch id="requirePin" checked={requirePin} onCheckedChange={setRequirePin} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pinTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="pinTimeout"
                    type="number"
                    min="1"
                    max="480"
                    value={pinTimeout}
                    onChange={(e) => setPinTimeout(e.target.value)}
                    disabled={!requirePin}
                  />
                  <p className="text-xs text-gray-500">Automatically log out after period of inactivity</p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowRemoteAccess" className="text-base">
                      Allow Remote Access
                    </Label>
                    <p className="text-sm text-gray-500">Enable access to POS from outside the local network</p>
                  </div>
                  <Switch id="allowRemoteAccess" checked={allowRemoteAccess} onCheckedChange={setAllowRemoteAccess} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth" className="text-base">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-gray-500">Require additional verification for admin accounts</p>
                  </div>
                  <Switch id="twoFactorAuth" checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                </div>

                <div className="pt-4 space-y-4">
                  <h3 className="font-medium">Access Controls</h3>

                  <div className="space-y-2">
                    <Label htmlFor="managerOverride">Manager Override PIN</Label>
                    <Input id="managerOverride" type="password" placeholder="Enter PIN for manager override" />
                    <p className="text-xs text-gray-500">Used for approving voids, refunds, and discounts</p>
                  </div>

                  <Button type="button" variant="outline" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Reset All Staff PINs
                  </Button>
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Audit Log
                  </Button>
                  <Button onClick={handleSaveSecurity}>Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

