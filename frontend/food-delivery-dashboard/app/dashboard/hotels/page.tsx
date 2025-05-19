"use client"

import React, { useState, useEffect } from "react"
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
import axios from "axios"

// types.ts
export interface MenuItem {
  _id: string;
  hotelID: string;
  categoryName: string;
  foodName: string;
  price: number;
  description?: string;
}

export interface Complaint {
  id: number;
  text: string;
  date: string;
}

export interface Hotel {
  _id: string;
  userID: string;
  hotelName: string;
  hotelAddress: string;
  isAuthorized: boolean;
  location: string;
  rating: number;
  opentime: string;
}

export default function HotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedHotelId, setExpandedHotelId] = useState<number | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogType, setDialogType] = useState<"menu" | "complaints">("menu")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [complaints, setComplaints] = useState<Complaint[]>([])

  // Load hotels on mount
  useEffect(() => {
    fetch("http://localhost:3000/api/hotel/") // You can create this endpoint too
      .then((res) => res.json())
      .then(setHotels)
  }, [])

  // Filter hotels
  console.log("Filtered Hotels: ", hotels);
  
  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "authorized" && hotel.isAuthorized) ||
      (statusFilter === "unauthorized" && !hotel.isAuthorized)
    return matchesSearch && matchesStatus
  })

  // Toggle authorization
  const toggleHotelAuthorization = async (hotelId: string, isAuthorized: boolean) => {
    const endpoint = isAuthorized ? "http://localhost:3000/api/hotel/revokeHotel" : "http://localhost:3000/api/hotel/authorizeHotel"
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hotelId }),
    })
    if (res.ok) {
      const data = await res.json()
      setHotels((prev) =>
        prev.map((h) => (h._id === hotelId ? { ...h, isAuthorized: !isAuthorized } : h))
      )
    }
  }

  // Remove hotel
  const removeHotel = (hotelId: string) => {
    setHotels((prev) => prev.filter((h) => h._id !== hotelId))
    setIsDialogOpen(false)
  }

  // Open dialog
  const openDialog = async (hotel: Hotel, type: "menu" | "complaints") => {
    setSelectedHotel(hotel)
    setDialogType(type)
    setIsDialogOpen(true)

    if (type === "menu") {
      const res = await axios.get(`http://localhost:3000/api/hotel/foods/getById/${hotel._id}`)
      console.log(res.data);
      
      const items = await res.data.data
      setMenuItems(items)
    } else {
      const res = await axios.get(`http://localhost:3000/api/review/`)
      const comp = await res.data
      console.log(res.data)
      setComplaints(comp)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Hotel Management</h1>
        <p className="text-gray-500">Manage all hotels in the system</p>
      </div>

      {/* Filters */}
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

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
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
                      <TableRow key={hotel._id}>
                        <TableCell className="font-medium">
                          <button
                            onClick={() =>
                              setExpandedHotelId(expandedHotelId === hotel._id ? null : hotel._id)
                            }
                            className="flex items-center cursor-pointer"
                          >
                            <ChevronDown
                              className={`h-4 w-4 mr-2 transition-transform ${
                                expandedHotelId === hotel._id ? "transform rotate-180" : ""
                              }`}
                            />
                            {hotel.hotelName}
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
                            variant="default"
                            className={
                              hotel.isAuthorized
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            }
                          >
                            {hotel.isAuthorized ? "Active" : "Pending"}
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
                              <DropdownMenuItem
                                onClick={() => toggleHotelAuthorization(hotel._id, hotel.isAuthorized)}
                              >
                                {hotel.isAuthorized ? "Revoke Authorization" : "Authorize Hotel"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDialog(hotel, "menu")}>
                                View Menu Items
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDialog(hotel, "complaints")}>
                                View Complaints
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => removeHotel(hotel._id)}
                              >
                                Remove Hotel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Details Row */}
                      {expandedHotelId === hotel._id && (
                        <TableRow className="bg-muted/50">
                          <TableCell colSpan={6} className="p-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">Hotel Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">Created At</p>
                                    <p className="text-sm">{new Date(hotel.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => openDialog(hotel, "menu")}>
                                  View Menu
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => openDialog(hotel, "complaints")}>
                                  View Complaints
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => removeHotel(hotel._id)}>
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

      {/* Dialog for Menu or Complaints */}
      {selectedHotel && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {dialogType === "menu"
                  ? `Menu Items - ${selectedHotel.hotelName}`
                  : `Complaints - ${selectedHotel.hotelName}`}
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
                    {menuItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell className="font-medium">{item.foodName}</TableCell>
                        <TableCell>{item.categoryName}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto space-y-4">
  {complaints.length === 0 ? (
    <p className="text-center py-4 text-muted-foreground">No complaints found</p>
  ) : (
    complaints.map((complain: any, index: any) => (
      <Card key={index}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-medium text-muted-foreground">
              {new Date(complain.createdAt).toLocaleString()}
            </p>
            <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
              {complain.type}
            </span>
          </div>
          <p className="text-base font-semibold mb-1">{complain.comment}</p>
          <p className="text-sm text-muted-foreground">Helpful: {complain.count}</p>
        </CardContent>
      </Card>
    ))
  )}
</div>

            )}

            <DialogFooter>
              {dialogType === "complaints" && complaints.length > 0 && (
                <Button variant="destructive" onClick={() => removeHotel(selectedHotel._id)}>
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