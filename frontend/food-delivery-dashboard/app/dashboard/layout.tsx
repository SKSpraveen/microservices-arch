"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Home, Hotel, LogOut, Package, ShoppingBag, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check if user is authenticated
    // const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
    // if (!isAuthenticated) {
    //   router.push("/login")
    // }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/login")
  }

  if (!isMounted) {
    return null // Prevent hydration errors
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50 w-full">
        <Sidebar className="border-r border-gray-200">
          <SidebarHeader className="border-b border-gray-200 px-6 py-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-purple-700" />
              <span className="font-bold text-xl text-purple-800">FoodAdmin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard">
                  <button onClick={() => router.push("/dashboard")}>
                    <Home className="h-5 w-5" />
                    <span>Dashboard</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/users"} tooltip="Users">
                  <button onClick={() => router.push("/dashboard/users")}>
                    <Users className="h-5 w-5" />
                    <span>Users</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/hotels"} tooltip="Hotels">
                  <button onClick={() => router.push("/dashboard/hotels")}>
                    <Hotel className="h-5 w-5" />
                    <span>Hotels</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/orders"} tooltip="Orders">
                  <button onClick={() => router.push("/dashboard/orders")}>
                    <Package className="h-5 w-5" />
                    <span>Orders</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/analytics"} tooltip="Analytics">
                  <button onClick={() => router.push("/dashboard/analytics")}>
                    <BarChart3 className="h-5 w-5" />
                    <span>Analytics</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t border-gray-200">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Logout">
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex h-16 items-center gap-4 border-b bg-white px-6">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-4">
              <span className="text-sm font-medium">Admin User</span>
              <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-semibold">
                A
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
