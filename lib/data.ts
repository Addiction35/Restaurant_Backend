// Types for our data model
export interface MenuItem {
  id: string
  image: string
  title: string
  price: number
  discount?: number
  type: "Veg" | "Non Veg"
  category: string
  description?: string
  ingredients?: string[]
  allergens?: string[]
  available: boolean
}

export interface CartItem extends MenuItem {
  quantity: number
  notes?: string
}

export interface Category {
  id: string
  icon: string
  label: string
  items: number
}

export interface Table {
  id: string
  number: string
  customer: string
  status: "Available" | "Occupied" | "Reserved"
  capacity: number
  section: "Main" | "Outdoor" | "Private" | "Bar"
  currentOrderId?: string
}

export interface Order {
  id: string
  tableId: string
  tableNumber: string
  items: number
  kitchen: string
  status: "Pending" | "Processing" | "Completed" | "Cancelled"
  diningMode: "Dine in" | "Take Away" | "Delivery"
  cartItems: CartItem[]
  total: number
  tax: number
  subtotal: number
  timestamp: string
  paymentStatus: "Unpaid" | "Paid" | "Partial"
  paymentMethod?: "Cash" | "Card" | "QR Code"
  server?: string
  deliveryInfo?: DeliveryInfo
}

export interface DeliveryInfo {
  address: string
  contactName: string
  contactPhone: string
  deliveryNotes?: string
  estimatedDeliveryTime?: string
  driverId?: string
}

export interface Reservation {
  id: string
  tableId: string
  customerName: string
  contactPhone: string
  email?: string
  date: string
  time: string
  duration: number // in minutes
  partySize: number
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed"
  notes?: string
}

export interface Driver {
  id: string
  name: string
  phone: string
  status: "Available" | "On Delivery" | "Off Duty"
  currentOrderId?: string
  vehicle: string
}

export interface User {
  id: string
  name: string
  role: "Admin" | "Manager" | "Server" | "Kitchen" | "Cashier"
  email: string
  pin: string
  active: boolean
}

export interface FinancialTransaction {
  id: string
  orderId?: string
  type: "Sale" | "Refund" | "Expense" | "Adjustment"
  amount: number
  method: "Cash" | "Card" | "QR Code" | "Other"
  timestamp: string
  description?: string
  category?: string
  staffId: string
}

// Mock data
export const menuItems: MenuItem[] = [
  {
    id: "1",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "Tasty Vegetable Salad Healthy Diet",
    price: 17.99,
    discount: 20,
    type: "Veg",
    category: "Breakfast",
    description: "Fresh mixed vegetables with our special house dressing",
    ingredients: ["Lettuce", "Tomato", "Cucumber", "Bell Pepper", "Olive Oil"],
    allergens: ["Nuts"],
    available: true,
  },
  {
    id: "2",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "Original Chess Meat Burger With Chips",
    price: 23.99,
    type: "Non Veg",
    category: "Burges",
    description: "Juicy beef patty with melted cheese and crispy fries",
    ingredients: ["Beef", "Cheese", "Lettuce", "Tomato", "Bun", "Potatoes"],
    allergens: ["Gluten", "Dairy"],
    available: true,
  },
  {
    id: "3",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "Tacos Salsa With Chickens Grilled",
    price: 14.99,
    type: "Non Veg",
    category: "Main Course",
    description: "Grilled chicken tacos with fresh salsa and guacamole",
    ingredients: ["Chicken", "Tortilla", "Tomato", "Onion", "Cilantro"],
    allergens: ["Gluten"],
    available: true,
  },
  {
    id: "4",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "Fresh Orange Juice With Basil Seed",
    price: 12.99,
    type: "Veg",
    category: "Breakfast",
    description: "Freshly squeezed orange juice with basil seeds",
    ingredients: ["Orange", "Basil Seeds", "Sugar"],
    allergens: [],
    available: true,
  },
  {
    id: "5",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "Meat Sushi Maki With Tuna, Ship And Other",
    price: 9.99,
    type: "Non Veg",
    category: "Main Course",
    description: "Assorted sushi rolls with fresh tuna and shrimp",
    ingredients: ["Rice", "Tuna", "Shrimp", "Nori", "Avocado"],
    allergens: ["Seafood", "Soy"],
    available: true,
  },
  {
    id: "6",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "Original Chess Burger With French Fries",
    price: 10.59,
    discount: 20,
    type: "Veg",
    category: "Burges",
    description: "Vegetarian burger with cheese and crispy french fries",
    ingredients: ["Plant-based Patty", "Cheese", "Lettuce", "Tomato", "Bun", "Potatoes"],
    allergens: ["Gluten", "Dairy"],
    available: true,
  },
  {
    id: "7",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "Creamy Tomato Soup with Croutons",
    price: 8.99,
    type: "Veg",
    category: "Soups",
    description: "Rich tomato soup with cream and crunchy croutons",
    ingredients: ["Tomato", "Cream", "Onion", "Garlic", "Bread"],
    allergens: ["Dairy", "Gluten"],
    available: true,
  },
  {
    id: "8",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "Spaghetti Carbonara with Bacon",
    price: 16.99,
    type: "Non Veg",
    category: "Pasta",
    description: "Classic carbonara with crispy bacon and parmesan",
    ingredients: ["Pasta", "Bacon", "Egg", "Parmesan", "Black Pepper"],
    allergens: ["Gluten", "Dairy", "Egg"],
    available: true,
  },
  {
    id: "9",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-12%20at%2012.32.42%20PM-QicgA83ZI0TfZlOynDOqlhOGnbwzEv.jpeg",
    title: "Chicken Noodle Soup",
    price: 9.99,
    type: "Non Veg",
    category: "Soups",
    description: "Hearty chicken soup with vegetables and noodles",
    ingredients: ["Chicken", "Noodles", "Carrot", "Celery", "Onion"],
    allergens: ["Gluten"],
    available: true,
  },
]

export const categories: Category[] = [
  { id: "all", icon: "Grid", label: "All", items: menuItems.length },
  {
    id: "breakfast",
    icon: "Coffee",
    label: "Breakfast",
    items: menuItems.filter((item) => item.category === "Breakfast").length,
  },
  { id: "soups", icon: "Soup", label: "Soups", items: menuItems.filter((item) => item.category === "Soups").length },
  {
    id: "pasta",
    icon: "UtensilsCrossed",
    label: "Pasta",
    items: menuItems.filter((item) => item.category === "Pasta").length,
  },
  {
    id: "main-course",
    icon: "ChefHat",
    label: "Main Course",
    items: menuItems.filter((item) => item.category === "Main Course").length,
  },
  {
    id: "burges",
    icon: "Sandwich",
    label: "Burges",
    items: menuItems.filter((item) => item.category === "Burges").length,
  },
]

export const tables: Table[] = [
  { id: "1", number: "1", customer: "John Doe", status: "Occupied", capacity: 4, section: "Main" },
  { id: "2", number: "2", customer: "Jane Smith", status: "Available", capacity: 2, section: "Main" },
  { id: "3", number: "3", customer: "Robert Johnson", status: "Reserved", capacity: 6, section: "Private" },
  {
    id: "4",
    number: "4",
    customer: "Floyd Miles",
    status: "Occupied",
    capacity: 4,
    section: "Main",
    currentOrderId: "1",
  },
  { id: "5", number: "5", customer: "", status: "Available", capacity: 2, section: "Outdoor" },
  { id: "6", number: "6", customer: "", status: "Available", capacity: 4, section: "Outdoor" },
  { id: "7", number: "7", customer: "Michael Brown", status: "Reserved", capacity: 8, section: "Private" },
  { id: "8", number: "8", customer: "Sarah Wilson", status: "Occupied", capacity: 2, section: "Bar" },
  { id: "9", number: "9", customer: "", status: "Available", capacity: 4, section: "Main" },
  { id: "10", number: "10", customer: "", status: "Available", capacity: 6, section: "Main" },
  { id: "11", number: "11", customer: "David Lee", status: "Occupied", capacity: 2, section: "Bar" },
  { id: "12", number: "12", customer: "", status: "Available", capacity: 4, section: "Outdoor" },
]

export const orders: Order[] = [
  {
    id: "1",
    tableId: "4",
    tableNumber: "T4",
    items: 6,
    kitchen: "Kitchen",
    status: "Processing",
    diningMode: "Dine in",
    cartItems: [
      { ...menuItems[0], quantity: 2 },
      { ...menuItems[3], quantity: 1 },
      { ...menuItems[6], quantity: 3 },
    ],
    total: 82.94,
    tax: 3.95,
    subtotal: 78.99,
    timestamp: new Date().toISOString(),
    paymentStatus: "Unpaid",
    server: "Emma Johnson",
  },
  {
    id: "2",
    tableId: "1",
    tableNumber: "T1",
    items: 4,
    kitchen: "Kitchen",
    status: "Pending",
    diningMode: "Take Away",
    cartItems: [
      { ...menuItems[1], quantity: 2 },
      { ...menuItems[4], quantity: 2 },
    ],
    total: 70.96,
    tax: 3.38,
    subtotal: 67.58,
    timestamp: new Date().toISOString(),
    paymentStatus: "Unpaid",
    server: "James Smith",
  },
  {
    id: "3",
    tableId: "8",
    tableNumber: "T8",
    items: 3,
    kitchen: "Kitchen",
    status: "Pending",
    diningMode: "Dine in",
    cartItems: [
      { ...menuItems[2], quantity: 1 },
      { ...menuItems[5], quantity: 2 },
    ],
    total: 37.97,
    tax: 1.81,
    subtotal: 36.16,
    timestamp: new Date().toISOString(),
    paymentStatus: "Unpaid",
    server: "Emma Johnson",
  },
  {
    id: "4",
    tableId: "",
    tableNumber: "D1",
    items: 5,
    kitchen: "Kitchen",
    status: "Processing",
    diningMode: "Delivery",
    cartItems: [
      { ...menuItems[1], quantity: 2 },
      { ...menuItems[3], quantity: 1 },
      { ...menuItems[8], quantity: 2 },
    ],
    total: 81.95,
    tax: 3.9,
    subtotal: 78.05,
    timestamp: new Date().toISOString(),
    paymentStatus: "Paid",
    paymentMethod: "Card",
    server: "James Smith",
    deliveryInfo: {
      address: "123 Main St, Anytown, USA",
      contactName: "Lisa Johnson",
      contactPhone: "555-123-4567",
      deliveryNotes: "Apartment 4B, ring twice",
      estimatedDeliveryTime: "30-45 minutes",
      driverId: "1",
    },
  },
  {
    id: "5",
    tableId: "11",
    tableNumber: "T11",
    items: 2,
    kitchen: "Kitchen",
    status: "Completed",
    diningMode: "Dine in",
    cartItems: [
      { ...menuItems[7], quantity: 1 },
      { ...menuItems[4], quantity: 1 },
    ],
    total: 28.28,
    tax: 1.35,
    subtotal: 26.93,
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    paymentStatus: "Paid",
    paymentMethod: "Cash",
    server: "Emma Johnson",
  },
]

export const reservations: Reservation[] = [
  {
    id: "1",
    tableId: "3",
    customerName: "Robert Johnson",
    contactPhone: "555-987-6543",
    email: "robert@example.com",
    date: "2025-03-25",
    time: "19:00",
    duration: 120,
    partySize: 6,
    status: "Confirmed",
    notes: "Anniversary celebration",
  },
  {
    id: "2",
    tableId: "7",
    customerName: "Michael Brown",
    contactPhone: "555-456-7890",
    email: "michael@example.com",
    date: "2025-03-25",
    time: "20:00",
    duration: 180,
    partySize: 8,
    status: "Confirmed",
    notes: "Birthday party, needs cake service",
  },
  {
    id: "3",
    tableId: "10",
    customerName: "Jennifer Davis",
    contactPhone: "555-789-0123",
    email: "jennifer@example.com",
    date: "2025-03-26",
    time: "18:30",
    duration: 90,
    partySize: 4,
    status: "Pending",
    notes: "Prefers window seating",
  },
  {
    id: "4",
    tableId: "5",
    customerName: "William Wilson",
    contactPhone: "555-234-5678",
    email: "william@example.com",
    date: "2025-03-26",
    time: "19:30",
    duration: 120,
    partySize: 2,
    status: "Confirmed",
    notes: "Allergic to nuts",
  },
  {
    id: "5",
    tableId: "9",
    customerName: "Elizabeth Taylor",
    contactPhone: "555-345-6789",
    email: "elizabeth@example.com",
    date: "2025-03-27",
    time: "20:00",
    duration: 120,
    partySize: 4,
    status: "Cancelled",
    notes: "Cancelled due to illness",
  },
]

export const drivers: Driver[] = [
  {
    id: "1",
    name: "Alex Martinez",
    phone: "555-111-2222",
    status: "On Delivery",
    currentOrderId: "4",
    vehicle: "Motorcycle",
  },
  {
    id: "2",
    name: "Samantha Lee",
    phone: "555-222-3333",
    status: "Available",
    vehicle: "Car",
  },
  {
    id: "3",
    name: "Carlos Rodriguez",
    phone: "555-333-4444",
    status: "Off Duty",
    vehicle: "Bicycle",
  },
  {
    id: "4",
    name: "Jessica Kim",
    phone: "555-444-5555",
    status: "Available",
    vehicle: "Motorcycle",
  },
]

export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    role: "Admin",
    email: "admin@chilipos.com",
    pin: "1234",
    active: true,
  },
  {
    id: "2",
    name: "Emma Johnson",
    role: "Server",
    email: "emma@chilipos.com",
    pin: "2345",
    active: true,
  },
  {
    id: "3",
    name: "James Smith",
    role: "Server",
    email: "james@chilipos.com",
    pin: "3456",
    active: true,
  },
  {
    id: "4",
    name: "Maria Garcia",
    role: "Kitchen",
    email: "maria@chilipos.com",
    pin: "4567",
    active: true,
  },
  {
    id: "5",
    name: "David Lee",
    role: "Manager",
    email: "david@chilipos.com",
    pin: "5678",
    active: true,
  },
  {
    id: "6",
    name: "Sarah Wilson",
    role: "Cashier",
    email: "sarah@chilipos.com",
    pin: "6789",
    active: true,
  },
]

export const transactions: FinancialTransaction[] = [
  {
    id: "1",
    orderId: "5",
    type: "Sale",
    amount: 28.28,
    method: "Cash",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    description: "Table 11 payment",
    staffId: "6",
  },
  {
    id: "2",
    orderId: "4",
    type: "Sale",
    amount: 81.95,
    method: "Card",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    description: "Delivery order payment",
    staffId: "6",
  },
  {
    id: "3",
    type: "Expense",
    amount: 150.0,
    method: "Card",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    description: "Grocery supplies",
    category: "Inventory",
    staffId: "5",
  },
  {
    id: "4",
    type: "Expense",
    amount: 75.5,
    method: "Cash",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    description: "Cleaning supplies",
    category: "Maintenance",
    staffId: "5",
  },
  {
    id: "5",
    orderId: "old-order-1",
    type: "Refund",
    amount: 23.99,
    method: "Card",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    description: "Customer complaint - wrong order",
    staffId: "5",
  },
]

// Mock API functions
export const api = {
  // Menu items
  getMenuItems: () => Promise.resolve(menuItems),
  getMenuItemsByCategory: (categoryId: string) => {
    if (categoryId === "all") {
      return Promise.resolve(menuItems)
    }
    const category = categories.find((c) => c.id === categoryId)?.label
    return Promise.resolve(menuItems.filter((item) => item.category === category))
  },
  getMenuItem: (id: string) => Promise.resolve(menuItems.find((item) => item.id === id)),
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => {
    const index = menuItems.findIndex((item) => item.id === id)
    if (index !== -1) {
      menuItems[index] = { ...menuItems[index], ...updates }
      return Promise.resolve(menuItems[index])
    }
    return Promise.reject(new Error("Menu item not found"))
  },
  createMenuItem: (item: Omit<MenuItem, "id">) => {
    const newItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
    }
    menuItems.push(newItem)
    return Promise.resolve(newItem)
  },
  deleteMenuItem: (id: string) => {
    const index = menuItems.findIndex((item) => item.id === id)
    if (index !== -1) {
      menuItems.splice(index, 1)
      return Promise.resolve(true)
    }
    return Promise.reject(new Error("Menu item not found"))
  },

  // Categories
  getCategories: () => Promise.resolve(categories),
  updateCategoryCount: () => {
    categories.forEach((category) => {
      if (category.id === "all") {
        category.items = menuItems.length
      } else {
        const categoryName = category.label
        category.items = menuItems.filter((item) => item.category === categoryName).length
      }
    })
    return Promise.resolve(categories)
  },

  // Tables
  getTables: () => Promise.resolve(tables),
  getTableById: (id: string) => Promise.resolve(tables.find((table) => table.id === id)),
  getTablesBySection: (section: Table["section"]) =>
    Promise.resolve(tables.filter((table) => table.section === section)),
  updateTable: (id: string, updates: Partial<Table>) => {
    const index = tables.findIndex((table) => table.id === id)
    if (index !== -1) {
      tables[index] = { ...tables[index], ...updates }
      return Promise.resolve(tables[index])
    }
    return Promise.reject(new Error("Table not found"))
  },

  // Orders
  getOrders: () => Promise.resolve(orders),
  getOrderById: (id: string) => Promise.resolve(orders.find((order) => order.id === id)),
  getOrdersByStatus: (status: Order["status"]) => Promise.resolve(orders.filter((order) => order.status === status)),
  getOrdersByTable: (tableId: string) => Promise.resolve(orders.filter((order) => order.tableId === tableId)),
  createOrder: (order: Omit<Order, "id" | "timestamp">) => {
    const newOrder = {
      ...order,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    }
    orders.push(newOrder)
    return Promise.resolve(newOrder)
  },
  updateOrder: (id: string, updates: Partial<Order>) => {
    const index = orders.findIndex((order) => order.id === id)
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates }
      return Promise.resolve(orders[index])
    }
    return Promise.reject(new Error("Order not found"))
  },
  deleteOrder: (id: string) => {
    const index = orders.findIndex((order) => order.id === id)
    if (index !== -1) {
      orders.splice(index, 1)
      return Promise.resolve(true)
    }
    return Promise.reject(new Error("Order not found"))
  },

  // Reservations
  getReservations: () => Promise.resolve(reservations),
  getReservationById: (id: string) => Promise.resolve(reservations.find((res) => res.id === id)),
  getReservationsByDate: (date: string) => Promise.resolve(reservations.filter((res) => res.date === date)),
  createReservation: (reservation: Omit<Reservation, "id">) => {
    const newReservation = {
      ...reservation,
      id: Math.random().toString(36).substring(2, 9),
    }
    reservations.push(newReservation)
    return Promise.resolve(newReservation)
  },
  updateReservation: (id: string, updates: Partial<Reservation>) => {
    const index = reservations.findIndex((res) => res.id === id)
    if (index !== -1) {
      reservations[index] = { ...reservations[index], ...updates }
      return Promise.resolve(reservations[index])
    }
    return Promise.reject(new Error("Reservation not found"))
  },
  deleteReservation: (id: string) => {
    const index = reservations.findIndex((res) => res.id === id)
    if (index !== -1) {
      reservations.splice(index, 1)
      return Promise.resolve(true)
    }
    return Promise.reject(new Error("Reservation not found"))
  },

  // Drivers
  getDrivers: () => Promise.resolve(drivers),
  getAvailableDrivers: () => Promise.resolve(drivers.filter((driver) => driver.status === "Available")),
  assignDriver: (orderId: string, driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId)
    if (driver) {
      driver.status = "On Delivery"
      driver.currentOrderId = orderId

      const order = orders.find((o) => o.id === orderId)
      if (order && order.deliveryInfo) {
        order.deliveryInfo.driverId = driverId
      }

      return Promise.resolve(driver)
    }
    return Promise.reject(new Error("Driver not found"))
  },
  completeDelivery: (driverId: string) => {
    const driver = drivers.find((d) => d.id === driverId)
    if (driver) {
      driver.status = "Available"
      driver.currentOrderId = undefined
      return Promise.resolve(driver)
    }
    return Promise.reject(new Error("Driver not found"))
  },

  // Users
  getUsers: () => Promise.resolve(users),
  getUserById: (id: string) => Promise.resolve(users.find((user) => user.id === id)),
  getUsersByRole: (role: User["role"]) => Promise.resolve(users.filter((user) => user.role === role)),
  authenticateUser: (email: string, pin: string) => {
    const user = users.find((user) => user.email === email && user.pin === pin && user.active)
    if (user) {
      return Promise.resolve(user)
    }
    return Promise.reject(new Error("Invalid credentials"))
  },
  createUser: (user: Omit<User, "id">) => {
    const newUser = {
      ...user,
      id: Math.random().toString(36).substring(2, 9),
    }
    users.push(newUser)
    return Promise.resolve(newUser)
  },
  updateUser: (id: string, updates: Partial<User>) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
      users[index] = { ...users[index], ...updates }
      return Promise.resolve(users[index])
    }
    return Promise.reject(new Error("User not found"))
  },

  // Financial Transactions
  getTransactions: () => Promise.resolve(transactions),
  getTransactionsByType: (type: FinancialTransaction["type"]) =>
    Promise.resolve(transactions.filter((tx) => tx.type === type)),
  getTransactionsByDateRange: (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    return Promise.resolve(
      transactions.filter((tx) => {
        const txDate = new Date(tx.timestamp).getTime()
        return txDate >= start && txDate <= end
      }),
    )
  },
  createTransaction: (transaction: Omit<FinancialTransaction, "id" | "timestamp">) => {
    const newTransaction = {
      ...transaction,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
    }
    transactions.push(newTransaction)
    return Promise.resolve(newTransaction)
  },

  // Dashboard Data
  getDashboardStats: () => {
    const totalSales = transactions.filter((tx) => tx.type === "Sale").reduce((sum, tx) => sum + tx.amount, 0)

    const totalExpenses = transactions.filter((tx) => tx.type === "Expense").reduce((sum, tx) => sum + tx.amount, 0)

    const totalRefunds = transactions.filter((tx) => tx.type === "Refund").reduce((sum, tx) => sum + tx.amount, 0)

    const netRevenue = totalSales - totalExpenses - totalRefunds

    const pendingOrders = orders.filter((order) => order.status === "Pending").length
    const processingOrders = orders.filter((order) => order.status === "Processing").length
    const completedOrders = orders.filter((order) => order.status === "Completed").length

    const availableTables = tables.filter((table) => table.status === "Available").length
    const occupiedTables = tables.filter((table) => table.status === "Occupied").length
    const reservedTables = tables.filter((table) => table.status === "Reserved").length

    return Promise.resolve({
      financial: {
        totalSales,
        totalExpenses,
        totalRefunds,
        netRevenue,
      },
      orders: {
        pending: pendingOrders,
        processing: processingOrders,
        completed: completedOrders,
        total: orders.length,
      },
      tables: {
        available: availableTables,
        occupied: occupiedTables,
        reserved: reservedTables,
        total: tables.length,
      },
      topSellingItems: getTopSellingItems(),
      recentTransactions: transactions.slice(0, 5),
    })
  },
}

// Helper function to get top selling items
function getTopSellingItems() {
  const itemSales: Record<string, { id: string; title: string; count: number }> = {}

  orders.forEach((order) => {
    order.cartItems.forEach((item) => {
      if (!itemSales[item.id]) {
        itemSales[item.id] = {
          id: item.id,
          title: item.title,
          count: 0,
        }
      }
      itemSales[item.id].count += item.quantity
    })
  })

  return Object.values(itemSales)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

