"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  type MenuItem,
  type CartItem,
  type Category,
  type Table,
  type Order,
  type Reservation,
  type Driver,
  type User,
  type FinancialTransaction,
  api,
  menuItems as initialMenuItems,
  categories as initialCategories,
  tables as initialTables,
  orders as initialOrders,
  reservations as initialReservations,
  drivers as initialDrivers,
  users as initialUsers,
  transactions as initialTransactions,
} from "@/lib/data"

interface POSContextType {
  // Data
  menuItems: MenuItem[]
  filteredMenuItems: MenuItem[]
  categories: Category[]
  tables: Table[]
  orders: Order[]
  reservations: Reservation[]
  drivers: Driver[]
  users: User[]
  transactions: FinancialTransaction[]

  // Cart state
  cart: CartItem[]
  activeTable: Table | null
  diningMode: "Dine in" | "Take Away" | "Delivery"
  activeCategory: string

  // User state
  currentUser: User | null

  // Delivery state
  deliveryInfo: {
    address: string
    contactName: string
    contactPhone: string
    deliveryNotes: string
  } | null

  // Calculations
  subtotal: number
  tax: number
  total: number

  // Actions - Menu
  setActiveCategory: (categoryId: string) => void
  searchMenuItems: (query: string) => void

  // Actions - Cart
  addToCart: (item: MenuItem) => void
  removeFromCart: (itemId: string) => void
  updateCartItemQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void

  // Actions - Tables
  setActiveTable: (table: Table | null) => void
  updateTableStatus: (tableId: string, status: Table["status"], customer?: string) => Promise<Table>

  // Actions - Orders
  setDiningMode: (mode: "Dine in" | "Take Away" | "Delivery") => void
  placeOrder: () => Promise<Order | undefined>
  updateOrderStatus: (orderId: string, status: Order["status"]) => Promise<Order | undefined>

  // Actions - Delivery
  setDeliveryInfo: (info: { address: string; contactName: string; contactPhone: string; deliveryNotes: string }) => void
  assignDriver: (orderId: string, driverId: string) => Promise<Driver | undefined>

  // Actions - Reservations
  createReservation: (reservation: Omit<Reservation, "id">) => Promise<Reservation | undefined>
  updateReservation: (id: string, updates: Partial<Reservation>) => Promise<Reservation | undefined>
  cancelReservation: (id: string) => Promise<boolean>

  // Actions - Authentication
  login: (email: string, pin: string) => Promise<User | undefined>
  logout: () => void

  // Actions - Transactions
  createTransaction: (
    transaction: Omit<FinancialTransaction, "id" | "timestamp">,
  ) => Promise<FinancialTransaction | undefined>

  // Dashboard
  getDashboardStats: () => Promise<any>
}

const POSContext = createContext<POSContextType | undefined>(undefined)

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State - Data
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[]>(initialMenuItems)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [orders, setOrders] = useState<Order[]>(initialOrders)
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers)
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(initialTransactions)

  // State - Cart
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeTable, setActiveTable] = useState<Table | null>(null)
  const [diningMode, setDiningMode] = useState<"Dine in" | "Take Away" | "Delivery">("Dine in")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  // State - User
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // State - Delivery
  const [deliveryInfo, setDeliveryInfo] = useState<{
    address: string
    contactName: string
    contactPhone: string
    deliveryNotes: string
  } | null>(null)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          menuItemsData,
          categoriesData,
          tablesData,
          ordersData,
          reservationsData,
          driversData,
          usersData,
          transactionsData,
        ] = await Promise.all([
          api.getMenuItems(),
          api.getCategories(),
          api.getTables(),
          api.getOrders(),
          api.getReservations(),
          api.getDrivers(),
          api.getUsers(),
          api.getTransactions(),
        ])

        setMenuItems(menuItemsData)
        setFilteredMenuItems(menuItemsData)
        setCategories(categoriesData)
        setTables(tablesData)
        setOrders(ordersData)
        setReservations(reservationsData)
        setDrivers(driversData)
        setUsers(usersData)
        setTransactions(transactionsData)
      } catch (error) {
        console.error("Error loading data:", error)
      }
    }

    loadData()
  }, [])

  // Filter menu items when category changes
  useEffect(() => {
    const filterItems = async () => {
      try {
        const items = await api.getMenuItemsByCategory(activeCategory)

        // Apply search filter if exists
        if (searchQuery) {
          const filtered = items.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
          setFilteredMenuItems(filtered)
        } else {
          setFilteredMenuItems(items)
        }
      } catch (error) {
        console.error("Error filtering items:", error)
      }
    }

    filterItems()
  }, [activeCategory, searchQuery])

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.05 // 5% tax
  const total = subtotal + tax

  // Actions - Menu
  const searchMenuItems = (query: string) => {
    setSearchQuery(query)
  }

  // Actions - Cart
  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        // Increase quantity if item already in cart
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        // Add new item to cart
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  // Actions - Tables
  const handleSetActiveTable = (table: Table | null) => {
    setTables((prevTables) => {
      return prevTables.map((t) => {
        if (t.id === table?.id) {
          return { ...t, status: "Occupied" }
        }
        return t
      })
    })
    setActiveTable(table)
  }

  const updateTableStatus = async (tableId: string, status: Table["status"], customer = "") => {
    try {
      const updatedTable = await api.updateTable(tableId, { status, customer })
      setTables((prevTables) => prevTables.map((table) => (table.id === tableId ? updatedTable : table)))
      return updatedTable
    } catch (error) {
      console.error("Error updating table status:", error)
      throw error
    }
  }

  // Actions - Orders
  const placeOrder = async () => {
    if (cart.length === 0) return

    try {
      let tableId = ""
      let tableNumber = ""

      if (diningMode === "Dine in") {
        if (!activeTable) return
        tableId = activeTable.id
        tableNumber = `T${activeTable.number}`
      } else if (diningMode === "Take Away") {
        tableNumber = "TA" + Math.floor(Math.random() * 100)
      } else if (diningMode === "Delivery") {
        if (!deliveryInfo) return
        tableNumber = "D" + Math.floor(Math.random() * 100)
      }

      const newOrder: Omit<Order, "id" | "timestamp"> = {
        tableId,
        tableNumber,
        items: cart.reduce((sum, item) => sum + item.quantity, 0),
        kitchen: "Kitchen",
        status: "Pending",
        diningMode,
        cartItems: [...cart],
        total,
        tax,
        subtotal,
        paymentStatus: "Unpaid",
        server: currentUser?.name || "Unknown",
      }

      // Add delivery info if it's a delivery order
      if (diningMode === "Delivery" && deliveryInfo) {
        newOrder.deliveryInfo = {
          ...deliveryInfo,
          estimatedDeliveryTime: "30-45 minutes",
        }
      }

      const createdOrder = await api.createOrder(newOrder)
      setOrders((prevOrders) => [...prevOrders, createdOrder])

      // Update table status if it's a dine-in order
      if (diningMode === "Dine in" && activeTable) {
        await updateTableStatus(activeTable.id, "Occupied", activeTable.customer)
        await api.updateTable(activeTable.id, { currentOrderId: createdOrder.id })
      }

      // Clear cart after order is placed
      clearCart()

      // Clear delivery info if it was a delivery order
      if (diningMode === "Delivery") {
        setDeliveryInfo(null)
      }

      return createdOrder
    } catch (error) {
      console.error("Error placing order:", error)
    }
  }

  const updateOrderStatus = async (orderId: string, status: Order["status"]) => {
    try {
      const updatedOrder = await api.updateOrder(orderId, { status })
      setOrders((prevOrders) => prevOrders.map((order) => (order.id === orderId ? updatedOrder : order)))

      // If order is completed and it's a dine-in order, update table status
      if (status === "Completed" && updatedOrder.diningMode === "Dine in" && updatedOrder.tableId) {
        await updateTableStatus(updatedOrder.tableId, "Available", "")
        await api.updateTable(updatedOrder.tableId, { currentOrderId: undefined })
      }

      return updatedOrder
    } catch (error) {
      console.error("Error updating order status:", error)
    }
  }

  // Actions - Delivery
  const handleSetDeliveryInfo = (info: {
    address: string
    contactName: string
    contactPhone: string
    deliveryNotes: string
  }) => {
    setDeliveryInfo(info)
  }

  const assignDriver = async (orderId: string, driverId: string) => {
    try {
      const driver = await api.assignDriver(orderId, driverId)
      setDrivers((prevDrivers) => prevDrivers.map((d) => (d.id === driverId ? driver : d)))

      // Update the order with driver info
      const order = orders.find((o) => o.id === orderId)
      if (order && order.deliveryInfo) {
        const updatedOrder = await api.updateOrder(orderId, {
          deliveryInfo: {
            ...order.deliveryInfo,
            driverId,
          },
        })

        setOrders((prevOrders) => prevOrders.map((o) => (o.id === orderId ? updatedOrder : o)))
      }

      return driver
    } catch (error) {
      console.error("Error assigning driver:", error)
    }
  }

  // Actions - Reservations
  const createReservation = async (reservation: Omit<Reservation, "id">) => {
    try {
      const newReservation = await api.createReservation(reservation)
      setReservations((prevReservations) => [...prevReservations, newReservation])

      // Update table status to reserved
      await updateTableStatus(reservation.tableId, "Reserved", reservation.customerName)

      return newReservation
    } catch (error) {
      console.error("Error creating reservation:", error)
    }
  }

  const updateReservation = async (id: string, updates: Partial<Reservation>) => {
    try {
      const updatedReservation = await api.updateReservation(id, updates)
      setReservations((prevReservations) => prevReservations.map((res) => (res.id === id ? updatedReservation : res)))

      // If table changed, update table statuses
      const oldReservation = reservations.find((res) => res.id === id)
      if (oldReservation && updates.tableId && oldReservation.tableId !== updates.tableId) {
        // Free up old table
        await updateTableStatus(oldReservation.tableId, "Available", "")

        // Reserve new table
        await updateTableStatus(updates.tableId, "Reserved", updatedReservation.customerName)
      }

      return updatedReservation
    } catch (error) {
      console.error("Error updating reservation:", error)
    }
  }

  const cancelReservation = async (id: string) => {
    try {
      const reservation = reservations.find((res) => res.id === id)
      if (!reservation) return false

      // Update reservation status to cancelled
      await api.updateReservation(id, { status: "Cancelled" })

      // Update table status to available
      await updateTableStatus(reservation.tableId, "Available", "")

      // Update local state
      setReservations((prevReservations) =>
        prevReservations.map((res) => (res.id === id ? { ...res, status: "Cancelled" } : res)),
      )

      return true
    } catch (error) {
      console.error("Error cancelling reservation:", error)
      return false
    }
  }

  // Actions - Authentication
  const login = async (email: string, pin: string) => {
    try {
      const user = await api.authenticateUser(email, pin)
      setCurrentUser(user)
      return user
    } catch (error) {
      console.error("Error logging in:", error)
    }
  }

  const logout = () => {
    setCurrentUser(null)
  }

  // Actions - Transactions
  const createTransaction = async (transaction: Omit<FinancialTransaction, "id" | "timestamp">) => {
    try {
      const newTransaction = await api.createTransaction(transaction)
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction])

      // If it's a sale, update the order payment status
      if (transaction.type === "Sale" && transaction.orderId) {
        const updatedOrder = await api.updateOrder(transaction.orderId, {
          paymentStatus: "Paid",
          paymentMethod: transaction.method as any,
        })

        setOrders((prevOrders) => prevOrders.map((order) => (order.id === transaction.orderId ? updatedOrder : order)))
      }

      return newTransaction
    } catch (error) {
      console.error("Error creating transaction:", error)
    }
  }

  // Dashboard
  const getDashboardStats = async () => {
    try {
      return await api.getDashboardStats()
    } catch (error) {
      console.error("Error getting dashboard stats:", error)
    }
  }

  const value = {
    // Data
    menuItems,
    filteredMenuItems,
    categories,
    tables,
    orders,
    reservations,
    drivers,
    users,
    transactions,

    // Cart state
    cart,
    activeTable,
    diningMode,
    activeCategory,

    // User state
    currentUser,

    // Delivery state
    deliveryInfo,

    // Calculations
    subtotal,
    tax,
    total,

    // Actions - Menu
    setActiveCategory,
    searchMenuItems,

    // Actions - Cart
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,

    // Actions - Tables
    setActiveTable: handleSetActiveTable,
    updateTableStatus,

    // Actions - Orders
    setDiningMode,
    placeOrder,
    updateOrderStatus,

    // Actions - Delivery
    setDeliveryInfo: handleSetDeliveryInfo,
    assignDriver,

    // Actions - Reservations
    createReservation,
    updateReservation,
    cancelReservation,

    // Actions - Authentication
    login,
    logout,

    // Actions - Transactions
    createTransaction,

    // Dashboard
    getDashboardStats,
  }

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>
}

export const usePOS = () => {
  const context = useContext(POSContext)
  if (context === undefined) {
    throw new Error("usePOS must be used within a POSProvider")
  }
  return context
}

