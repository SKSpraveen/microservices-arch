"use client"

import { useState, useEffect } from "react"
import {
  CalendarIcon,
  Check,
  Clock,
  Filter,
  MoreHorizontal,
  Search,
  X,
} from "lucide-react"
import { format, isToday, isYesterday } from "date-fns"
import {
  Badge,
} from "@/components/ui/badge"
import {
  Button,
} from "@/components/ui/button"
import {
  Calendar,
} from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Input,
} from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// 🔒 LocalStorage Key
const STORAGE_KEY = "orders_db"

// Define types
interface OrderItem {
  id: number | string
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  totalAmount: number
  status: "delivered" | "in-transit" | "pending" | "cancelled"
  hotelId: number
  hotelName: string
  userId: number
  userName: string
  driverId: number | null
  driverName: string | null
  createdAt: string
  items: OrderItem[]
}

// Mock orders
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    totalAmount: 45.99,
    status: "delivered",
    hotelId: 1,
    hotelName: "Grand Plaza Hotel",
    userId: 101,
    userName: "Alice Johnson",
    driverId: 201,
    driverName: "John Doe",
    createdAt: "2023-06-15T14:30:00Z",
    items: [
      { id: 1, name: "Margherita Pizza", quantity: 2, price: 12.99 },
      { id: 2, name: "Caesar Salad", quantity: 1, price: 8.99 },
      { id: 3, name: "Soda", quantity: 2, price: 2.99 },
    ],
  },
  {
    id: "ORD-002",
    totalAmount: 32.5,
    status: "in-transit",
    hotelId: 2,
    hotelName: "Sunset Resort",
    userId: 102,
    userName: "Bob Miller",
    driverId: 202,
    driverName: "Jane Smith",
    createdAt: "2023-06-16T12:15:00Z",
    items: [
      { id: 1, name: "Seafood Paella", quantity: 1, price: 24.99 },
      { id: 2, name: "Key Lime Pie", quantity: 1, price: 7.99 },
    ],
  },
  {
    id: "ORD-003",
    totalAmount: 16.99,
    status: "pending",
    hotelId: 3,
    hotelName: "Mountain View Lodge",
    userId: 103,
    userName: "Carol White",
    driverId: null,
    driverName: null,
    createdAt: "2023-06-16T15:45:00Z",
    items: [{ id: 1, name: "Bison Burger", quantity: 1, price: 16.99 }],
  },
  {
    id: "ORD-004",
    totalAmount: 28.97,
    status: "cancelled",
    hotelId: 4,
    hotelName: "Oceanfront Inn",
    userId: 104,
    userName: "Dave Clark",
    driverId: 203,
    driverName: "Mike Johnson",
    createdAt: "2023-06-15T18:20:00Z",
    items: [
      { id: 1, name: "Fish Tacos", quantity: 2, price: 10.99 },
      { id: 2, name: "Churros", quantity: 1, price: 5.99 },
    ],
  },
  {
    id: "ORD-005",
    totalAmount: 36.97,
    status: "delivered",
    hotelId: 5,
    hotelName: "City Center Hotel",
    userId: 105,
    userName: "Eve Adams",
    driverId: 204,
    driverName: "Sarah Williams",
    createdAt: "2023-06-14T19:10:00Z",
    items: [
      { id: 1, name: "Deep Dish Pizza", quantity: 1, price: 18.99 },
      { id: 2, name: "Chicago Hot Dog", quantity: 2, price: 8.99 },
    ],
  },
  {
    id: "ORD-006",
    totalAmount: 22.5,
    status: "pending",
    hotelId: 1,
    hotelName: "Grand Plaza Hotel",
    userId: 106,
    userName: "Frank Wilson",
    driverId: null,
    driverName: null,
    createdAt: "2023-06-17T10:00:00Z",
    items: [
      { id: 1, name: "Lasagna", quantity: 1, price: 14.99 },
      { id: 2, name: "Garlic Bread", quantity: 1, price: 4.99 },
      { id: 3, name: "Iced Tea", quantity: 1, price: 2.52 },
    ],
  },
  {
    id: "ORD-007",
    totalAmount: 50.0,
    status: "in-transit",
    hotelId: 2,
    hotelName: "Sunset Resort",
    userId: 107,
    userName: "Grace Lee",
    driverId: 202,
    driverName: "Jane Smith",
    createdAt: "2023-06-17T11:30:00Z",
    items: [
      { id: 1, name: "Steak", quantity: 1, price: 29.99 },
      { id: 2, name: "Mashed Potatoes", quantity: 1, price: 6.99 },
      { id: 3, name: "Wine", quantity: 1, price: 13.02 },
    ],
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
  const [sortBy, setSortBy] = useState("newest")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Load orders from localStorage on mount
  useEffect(() => {
    //localStorage.setItem(STORAGE_KEY, JSON.stringify(mockOrders))
    const savedOrders = localStorage.getItem(STORAGE_KEY)
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    } else {
      setOrders(mockOrders)
    }
  }, [])

  // // Save orders to localStorage whenever they change
  // useEffect(() => {
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  // }, [orders])

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const searchMatch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.driverName && order.driverName.toLowerCase().includes(searchTerm.toLowerCase()))

      const statusMatch =
        statusFilter === "all" || order.status === statusFilter

      const dateMatch =
        !dateFilter ||
        new Date(order.createdAt).toDateString() === dateFilter.toDateString()

      return searchMatch && statusMatch && dateMatch
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === "highest") {
        return b.totalAmount - a.totalAmount
      } else {
        return a.totalAmount - b.totalAmount
      }
    })

  // View order details
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  // Get badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <Check className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        )
      case "in-transit":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="h-3 w-3 mr-1" />
            In Transit
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-800 border-red-300">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Handle cancel order
  const handleCancelOrder = (orderId: string) => {
    const dbOrder = JSON.parse(localStorage.getItem(STORAGE_KEY) as string)
    const order = dbOrder.find((order: Order) => order.id === orderId)
    if (!order) return
    const updatedOrder = { ...order, status: "cancelled" }
    const updatedOrders = dbOrder.map((order: Order) =>
      order.id === orderId ? updatedOrder : order
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders))
    // Update the order in the state
    // const updatedOrders = orders.map((order) =>
    //   order.id === orderId ? { ...order, status: "cancelled" } : order
    // )
    setOrders(updatedOrders)
    setIsDialogOpen(false)
  }

  // Change order status
  const handleChangeStatus = (orderId: string, newStatus: string) => {
    const validStatuses = ["pending", "in-transit", "delivered", "cancelled"]
    if (!validStatuses.includes(newStatus)) return
    const dbOrder = JSON.parse(localStorage.getItem(STORAGE_KEY) as string)
    const order = dbOrder.find((order: Order) => order.id === orderId)
    if (!order) return
    const updatedOrder = { ...order, status: newStatus }
    const updatedOrders = dbOrder.map((order: Order) =>
      order.id === orderId ? updatedOrder : order
    )
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedOrders))
    setOrders(updatedOrders)
    setIsDialogOpen(false)
    // Update the order in the state
    // const updatedOrders = orders.map((order) =>
    //   order.id === orderId ? { ...order, status: newStatus as Order["status"] } : order
    // )
    setOrders(updatedOrders)
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Order Dashboard</h1>
        <p className="text-gray-500">Manage and track all orders</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>View and manage all orders in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full sm:w-[150px] justify-start text-left font-normal ${
                    !dateFilter ? "text-muted-foreground" : ""
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateFilter} onSelect={setDateFilter} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px] mb-6">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Amount</SelectItem>
              <SelectItem value="lowest">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>

          {/* Orders Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Hotel</TableHead>
                  <TableHead className="hidden md:table-cell">Customer</TableHead>
                  <TableHead className="hidden md:table-cell">Driver</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.hotelName}</TableCell>
                      <TableCell className="hidden md:table-cell">{order.userName}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {order.driverName || "Not Assigned"}
                      </TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(new Date(order.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => viewOrderDetails(order)}>View Details</DropdownMenuItem>
                            {(order.status === "pending" || order.status === "in-transit") && (
                              <>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  Cancel Order
                                </DropdownMenuItem>
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent>
                                    {["pending", "in-transit", "delivered"].map((status) => (
                                      <DropdownMenuItem
                                        key={status}
                                        onClick={() => handleChangeStatus(order.id, status)}
                                      >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Placed on{" "}
                {format(new Date(selectedOrder.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Customer</h4>
                  <p className="text-sm">{selectedOrder.userName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Hotel</h4>
                  <p className="text-sm">{selectedOrder.hotelName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Driver</h4>
                  <p className="text-sm">{selectedOrder.driverName || "Not Assigned"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <div className="text-sm">{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Order Items</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-center">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={2} className="text-right font-medium">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${selectedOrder.totalAmount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            <DialogFooter>
              {(selectedOrder.status === "pending" || selectedOrder.status === "in-transit") && (
                <Button variant="destructive" onClick={() => handleCancelOrder(selectedOrder.id)}>
                  Cancel Order
                </Button>
              )}
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Dev Tool: Reset Orders */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          localStorage.removeItem(STORAGE_KEY)
          setOrders(mockOrders)
        }}
      >
        Reset Orders
      </Button>
    </div>
  )
}