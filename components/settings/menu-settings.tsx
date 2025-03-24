"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePOS } from "@/context/pos-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Edit2, Trash2, Image, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import type { MenuItem, Category } from "@/lib/data"

export function MenuSettings() {
  const { toast } = useToast()
  const { menuItems, categories, api } = usePOS()
  const [activeTab, setActiveTab] = useState("items")
  const [searchQuery, setSearchQuery] = useState("")

  // Menu item state
  const [items, setItems] = useState<MenuItem[]>([])
  const [showItemForm, setShowItemForm] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null)

  // Category state
  const [cats, setCats] = useState<Category[]>([])
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)

  // Fetch data on component mount
  useEffect(() => {
    setItems(menuItems)
    setCats(categories)
  }, [menuItems, categories])

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredCategories = cats.filter((category) => category.label.toLowerCase().includes(searchQuery.toLowerCase()))

  // Item handlers
  const handleAddItem = () => {
    setEditingItem(null)
    setShowItemForm(true)
  }

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item)
    setShowItemForm(true)
  }

  const handleDeleteItem = (id: string) => {
    setDeleteItemId(id)
  }

  const confirmDeleteItem = async () => {
    if (!deleteItemId) return

    try {
      await api.deleteMenuItem(deleteItemId)
      setItems(items.filter((item) => item.id !== deleteItemId))
      toast({
        title: "Item deleted",
        description: "Menu item has been deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      })
    }

    setDeleteItemId(null)
  }

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(null)
    setShowCategoryForm(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setShowCategoryForm(true)
  }

  const handleDeleteCategory = (id: string) => {
    setDeleteCategoryId(id)
  }

  const confirmDeleteCategory = () => {
    if (!deleteCategoryId) return

    // Check if category has items
    const categoryToDelete = cats.find((c) => c.id === deleteCategoryId)
    if (categoryToDelete && categoryToDelete.items > 0) {
      toast({
        title: "Cannot delete category",
        description: "This category contains menu items. Please move or delete these items first.",
        variant: "destructive",
      })
      setDeleteCategoryId(null)
      return
    }

    // Remove category
    setCats(cats.filter((c) => c.id !== deleteCategoryId))
    toast({
      title: "Category deleted",
      description: "Category has been deleted successfully",
    })

    setDeleteCategoryId(null)
  }

  // Format price with discount
  const formatPrice = (price: number, discount?: number) => {
    if (!discount) return `$${price.toFixed(2)}`

    const discountedPrice = price - price * (discount / 100)
    return (
      <div>
        <span className="line-through text-gray-400 mr-2">${price.toFixed(2)}</span>
        <span className="text-green-600">${discountedPrice.toFixed(2)}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="items" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="items">Menu Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="modifiers">Modifiers</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {activeTab === "items" && (
            <Button onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          )}

          {activeTab === "categories" && (
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          )}
        </div>

        <TabsContent value="items" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items ({filteredItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                        No menu items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="w-10 h-10 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                            {item.image ? (
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Image className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          <Badge variant={item.type === "Veg" ? "success" : "default"}>{item.type}</Badge>
                        </TableCell>
                        <TableCell>{formatPrice(item.price, item.discount)}</TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {item.available ? "Available" : "Unavailable"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {showItemForm && (
            <MenuItemForm
              onClose={() => setShowItemForm(false)}
              existingItem={editingItem}
              categories={categories}
              onSave={(item) => {
                if (editingItem) {
                  // Update existing item
                  setItems(items.map((i) => (i.id === item.id ? item : i)))
                } else {
                  // Add new item
                  setItems([...items, item])
                }
              }}
            />
          )}

          <AlertDialog open={!!deleteItemId} onOpenChange={(open) => !open && setDeleteItemId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this menu item. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteItem} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Categories ({filteredCategories.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Items Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <div className="p-2 bg-gray-100 rounded-md inline-flex">
                            <span className="sr-only">{category.icon}</span>
                            <i className={`icon-${category.icon.toLowerCase()}`}></i>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{category.label}</TableCell>
                        <TableCell>{category.items}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={category.id === "all" || category.items > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {showCategoryForm && (
            <CategoryForm
              onClose={() => setShowCategoryForm(false)}
              existingCategory={editingCategory}
              onSave={(category) => {
                if (editingCategory) {
                  // Update existing category
                  setCats(cats.map((c) => (c.id === category.id ? category : c)))
                } else {
                  // Add new category
                  setCats([...cats, category])
                }
              }}
            />
          )}

          <AlertDialog open={!!deleteCategoryId} onOpenChange={(open) => !open && setDeleteCategoryId(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this category. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDeleteCategory} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TabsContent>

        <TabsContent value="modifiers" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Modifiers & Add-ons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 space-y-4">
                <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
                <h3 className="text-lg font-medium">Modifiers Coming Soon</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Modifiers and add-ons will allow you to customize menu items with options like toppings, sizes,
                  cooking preferences, and more. This feature is currently under development.
                </p>
                <Button variant="outline">Join Waiting List</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 space-y-4">
                <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
                <h3 className="text-lg font-medium">Inventory Management Coming Soon</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Track inventory levels, manage ingredient costs, and get automatic alerts when stocks run low. This
                  feature is currently under development and will be available in a future update.
                </p>
                <Button variant="outline">Join Waiting List</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface MenuItemFormProps {
  onClose: () => void
  existingItem?: MenuItem | null
  categories: Category[]
  onSave: (item: MenuItem) => void
}

function MenuItemForm({ onClose, existingItem, categories, onSave }: MenuItemFormProps) {
  const { toast } = useToast()
  const { api } = usePOS()

  // Form state
  const [title, setTitle] = useState(existingItem?.title || "")
  const [description, setDescription] = useState(existingItem?.description || "")
  const [price, setPrice] = useState(existingItem?.price.toString() || "")
  const [discount, setDiscount] = useState(existingItem?.discount?.toString() || "")
  const [category, setCategory] = useState(existingItem?.category || "")
  const [type, setType] = useState<"Veg" | "Non Veg">(existingItem?.type || "Veg")
  const [available, setAvailable] = useState(existingItem?.available !== false)
  const [ingredients, setIngredients] = useState(existingItem?.ingredients?.join(", ") || "")
  const [allergens, setAllergens] = useState(existingItem?.allergens?.join(", ") || "")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const itemData = {
        title,
        description,
        price: Number.parseFloat(price),
        discount: discount ? Number.parseFloat(discount) : undefined,
        category,
        type,
        available,
        ingredients: ingredients ? ingredients.split(",").map((i) => i.trim()) : [],
        allergens: allergens ? allergens.split(",").map((a) => a.trim()) : [],
        image:
          existingItem?.image ||
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
      }

      let savedItem

      if (existingItem) {
        // Update existing item
        savedItem = await api.updateMenuItem(existingItem.id, itemData)
      } else {
        // Create new item
        savedItem = await api.createMenuItem(itemData)
      }

      onSave(savedItem)

      toast({
        title: existingItem ? "Item updated" : "Item created",
        description: `${title} has been ${existingItem ? "updated" : "added"} successfully`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: existingItem ? "Failed to update item" : "Failed to create item",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{existingItem ? "Edit Menu Item" : "Add New Menu Item"}</DialogTitle>
          <DialogDescription>
            {existingItem ? "Update the details of this menu item." : "Fill in the details to create a new menu item."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Item Name</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter item name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.label}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter item description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Item Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as "Veg" | "Non Veg")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Veg">Vegetarian</SelectItem>
                  <SelectItem value="Non Veg">Non-Vegetarian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients (comma separated)</Label>
              <Textarea
                id="ingredients"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="e.g. Tomato, Cheese, Basil"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergens">Allergens (comma separated)</Label>
              <Textarea
                id="allergens"
                value={allergens}
                onChange={(e) => setAllergens(e.target.value)}
                placeholder="e.g. Gluten, Dairy, Nuts"
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Item Image</Label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded border flex items-center justify-center bg-gray-50 overflow-hidden">
                {existingItem?.image ? (
                  <img
                    src={existingItem.image || "/placeholder.svg"}
                    alt={existingItem.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="space-y-2">
                <Button type="button" variant="outline">
                  Upload Image
                </Button>
                <p className="text-xs text-gray-500">Recommended size: 500x500px. JPG, PNG or GIF.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="available">Available for ordering</Label>
            <Switch id="available" checked={available} onCheckedChange={setAvailable} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{existingItem ? "Update Item" : "Add Item"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface CategoryFormProps {
  onClose: () => void
  existingCategory?: Category | null
  onSave: (category: Category) => void
}

function CategoryForm({ onClose, existingCategory, onSave }: CategoryFormProps) {
  const { toast } = useToast()

  // Form state
  const [label, setLabel] = useState(existingCategory?.label || "")
  const [icon, setIcon] = useState(existingCategory?.icon || "")
  const [items, setItems] = useState(existingCategory?.items || 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Generate a unique ID for new categories
      const id = existingCategory?.id || label.toLowerCase().replace(/\s+/g, "-")

      const categoryData: Category = {
        id,
        label,
        icon: icon || "Tag",
        items: existingCategory?.items || 0,
      }

      onSave(categoryData)

      toast({
        title: existingCategory ? "Category updated" : "Category created",
        description: `${label} has been ${existingCategory ? "updated" : "added"} successfully`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: existingCategory ? "Failed to update category" : "Failed to create category",
        variant: "destructive",
      })
    }
  }

  const iconOptions = [
    { value: "Coffee", label: "Coffee" },
    { value: "Soup", label: "Soup" },
    { value: "Pizza", label: "Pizza" },
    { value: "Sandwich", label: "Sandwich" },
    { value: "Salad", label: "Salad" },
    { value: "Beef", label: "Beef" },
    { value: "Fish", label: "Fish" },
    { value: "ChefHat", label: "Chef Hat" },
    { value: "UtensilsCrossed", label: "Utensils" },
    { value: "Dessert", label: "Dessert" },
    { value: "Drink", label: "Drink" },
    { value: "Grid", label: "Grid" },
  ]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{existingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {existingCategory
              ? "Update the details of this category."
              : "Fill in the details to create a new category."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="label">Category Name</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Select value={icon} onValueChange={setIcon} required>
              <SelectTrigger>
                <SelectValue placeholder="Select an icon" />
              </SelectTrigger>
              <SelectContent>
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{existingCategory ? "Update Category" : "Add Category"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

