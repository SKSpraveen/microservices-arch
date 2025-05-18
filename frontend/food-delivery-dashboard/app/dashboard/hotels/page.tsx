"use client"

import { useState } from "react"
import { ChevronDown, Filter, MoreHorizontal, Search, Shield, ShieldAlert, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Mock data for hotels
const mockHotels = [
  {
    id: 1,
    name: "Grand Plaza Hotel",
    location: "New York, NY",
    rating: 4.5,
    isAuthorized: true,
    status: "active",
    createdAt: "2023-01-15",
    menuItems: [
      { id: 1, name: "Margherita Pizza", price: 12.99, category: "Pizza" },
      { id: 2, name: "Chicken Alfredo", price: 15.99, category: "Pasta" },
      { id: 3, name: "Caesar Salad", price: 8.99, category: "Salad" },
    ],
    complaints: [],
  },
  {
    id: 2,
    name: "Sunset Resort",
    location: "Miami, FL",
    rating: 4.2,
    isAuthorized: true,
    status: "active",
    createdAt: "2023-02-20",
    menuItems: [
      { id: 1, name: "Seafood Paella", price: 24.99, category: "Seafood" },
      { id: 2, name: "Grilled Salmon", price: 18.99, category: "Fish" },
      { id: 3, name: "Key Lime Pie", price: 7.99, category: "Dessert" },
    ],
    complaints: [{ id: 1, text: "Food was cold on arrival", date: "2023-05-15" }],
  },
  {
    id: 3,
    name: "Mountain View Lodge",
    location: "Denver, CO",
    rating: 4.7,
    isAuthorized: true,
    status: "active",
    createdAt: "2023-03-10",
    menuItems: [
      { id: 1, name: "Bison Burger", price: 16.99, category: "Burgers" },
      { id: 2, name: "Elk Stew", price: 14.99, category: "Stews" },
      { id: 3, name: "Apple Pie", price: 6.99, category: "Dessert" },
    ],
    complaints: [],
  },
  {
    id: 4,
    name: "Oceanfront Inn",
    location: "San Diego, CA",
    rating: 3.8,
    isAuthorized: false,
    status: "pending",
    createdAt: "2023-04-05",
    menuItems: [
      { id: 1, name: "Fish Tacos", price: 10.99, category: "Tacos" },
      { id: 2, name: "Shrimp Cocktail", price: 12.99, category: "Appetizers" },
      { id: 3, name: "Churros", price: 5.99, category: "Dessert" },
    ],
    complaints: [
      { id: 1, text: "Order was missing items", date: "2023-06-10" },
      { id: 2, text: "Very long delivery time", date: "2023-06-12" },
    ],
  },
  {
    id: 5,
    name: "City Center Hotel",
    location: "Chicago, IL",
    rating: 4.0,
    isAuthorized: true,
    status: "active",
    createdAt: "2023-05-12",
    menuItems: [
      { id: 1, name: "Deep Dish Pizza", price: 18.99, category: "Pizza" },
      { id: 2, name: "Chicago Hot Dog", price: 8.99, category: "Hot Dogs" },
      { id: 3, name: "Cheesecake", price: 7.99, category: "Dessert" },
    ],
    complaints: [],
  },
]

export default function HotelsPage() {
  const [hotels, setHotels] = useState(mockHotels)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedHotelId, setExpandedHotelId] = useState<number | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<"menu" | "complaints">("menu")

  // Filter hotels based on search term and status
  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "authorized" && hotel.isAuthorized) ||
      (statusFilter === "unauthorized" && !hotel.isAuthorized)

    return matchesSearch && matchesStatus
  })

  // Toggle hotel authorization
  const toggleHotelAuthorization = (hotelId: number) => {
    setHotels((prev) =>
      prev.map((hotel) => (hotel.id === hotelId ? { ...hotel, isAuthorized: !hotel.isAuthorized } : hotel)),
    )
  }

  // Remove hotel
  const removeHotel = (hotelId: number) => {
    setHotels((prev) => prev.filter((hotel) => hotel.id !== hotelId))
    setIsDialogOpen(false)
  }

  // Open dialog
  const openDialog = (hotel: any, type: "menu" | "complaints") => {
    setSelectedHotel(hotel)
    setDialogType(type)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Hotel Management</h1>
        <p className="text-gray-500">Manage all hotels in the system</p>
      </div>

      <div className="flex flex-col space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Hotels</CardTitle>
            <CardDescription>View and manage all registered hotels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search hotels..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hotels</SelectItem>
                  <SelectItem value="authorized">Authorized</SelectItem>
                  <SelectItem value="unauthorized">Unauthorized</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hotel Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead>Authorization</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHotels.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No hotels found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredHotels.map((hotel) => (
                      <>
                        <TableRow key={hotel.id}>
                          <TableCell className="font-medium">
                            <button
                              onClick={() => setExpandedHotelId(expandedHotelId === hotel.id ? null : hotel.id)}
                              className="flex items-center cursor-pointer"
                            >
                              <ChevronDown
                                className={`h-4 w-4 mr-2 transition-transform ${
                                  expandedHotelId === hotel.id ? "transform rotate-180" : ""
                                }`}
                              />
                              {hotel.name}
                            </button>
                          </TableCell>
                          <TableCell>{hotel.location}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              {hotel.rating}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge
                              variant={hotel.status === "active" ? "default" : "outline"}
                              className={
                                hotel.status === "active"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              }
                            >
                              {hotel.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {hotel.isAuthorized ? (
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                <Shield className="h-3 w-3 mr-1" />
                                Authorized
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-red-800 border-red-300">
                                <ShieldAlert className="h-3 w-3 mr-1" />
                                Unauthorized
                              </Badge>
                            )}
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
                                <DropdownMenuItem onClick={() => toggleHotelAuthorization(hotel.id)}>
                                  {hotel.isAuthorized ? "Revoke Authorization" : "Authorize Hotel"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openDialog(hotel, "menu")}>
                                  View Menu Items
                                </DropdownMenuItem>
                                {hotel.complaints.length > 0 && (
                                  <DropdownMenuItem onClick={() => openDialog(hotel, "complaints")}>
                                    View Complaints ({hotel.complaints.length})
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-red-600">Remove Hotel</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                        {expandedHotelId === hotel.id && (
                          <TableRow className="bg-muted/50">
                            <TableCell colSpan={6} className="p-4">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Hotel Details</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-muted-foreground">Created At</p>
                                      <p className="text-sm">{hotel.createdAt}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Menu Items</p>
                                      <p className="text-sm">{hotel.menuItems.length} items</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-muted-foreground">Complaints</p>
                                      <p className="text-sm">{hotel.complaints.length} complaints</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => openDialog(hotel, "menu")}>
                                    View Menu
                                  </Button>
                                  {hotel.complaints.length > 0 && (
                                    <Button size="sm" variant="outline" onClick={() => openDialog(hotel, "complaints")}>
                                      View Complaints
                                    </Button>
                                  )}
                                  <Button size="sm" variant="destructive" onClick={() => removeHotel(hotel.id)}>
                                    Remove Hotel
                                  </Button>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for Menu Items or Complaints */}
      {selectedHotel && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {dialogType === "menu" ? `Menu Items - ${selectedHotel.name}` : `Complaints - ${selectedHotel.name}`}
              </DialogTitle>
              <DialogDescription>
                {dialogType === "menu"
                  ? "View all menu items for this hotel"
                  : "Review customer complaints for this hotel"}
              </DialogDescription>
            </DialogHeader>

            {dialogType === "menu" ? (
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedHotel.menuItems.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto space-y-4">
                {selectedHotel.complaints.length === 0 ? (
                  <p className="text-center py-4 text-muted-foreground">No complaints found</p>
                ) : (
                  selectedHotel.complaints.map((complaint: any) => (
                    <Card key={complaint.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-medium">{complaint.date}</p>
                        </div>
                        <p className="text-sm">{complaint.text}</p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            <DialogFooter>
              {dialogType === "complaints" && selectedHotel.complaints.length > 0 && (
                <Button variant="destructive" onClick={() => removeHotel(selectedHotel.id)}>
                  Remove Hotel
                </Button>
              )}
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
