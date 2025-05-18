"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "@/components/ui/chart"
import { ArrowUpRight, UsersIcon, HotelIcon, PackageIcon, DollarSign } from "lucide-react"

export default function DashboardPage() {
  // Mock data for charts
  const orderData = [
    { name: "Mon", orders: 1 },
    { name: "Tue", orders: 19 },
    { name: "Wed", orders: 10 },
    { name: "Thu", orders: 2 },
    { name: "Fri", orders: 30 },
    { name: "Sat", orders: 4 },
    { name: "Sun", orders: 25 },
  ]

  const userTypeData = [
    { name: "Customers", value: 540 },
    { name: "Drivers", value: 120 },
    { name: "Hotel Owners", value: 85 },
  ]

  const COLORS = ["#8b5cf6", "#c084fc", "#d8b4fe"]

  const revenueData = [
    { name: "Week 1", revenue: 200 },
    { name: "Week 2", revenue: 0 },
    { name: "Week 3", revenue: 550 },
    { name: "Week 4", revenue: 2200 },
  ]

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Overview of your food delivery system</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <UsersIcon className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-bold">45</h3>
                </div>
              </div>
              <div className="flex items-center text-green-500 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                12%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <HotelIcon className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Hotels</p>
                  <h3 className="text-2xl font-bold">15</h3>
                </div>
              </div>
              <div className="flex items-center text-green-500 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                8%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <PackageIcon className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <h3 className="text-2xl font-bold">48</h3>
                </div>
              </div>
              <div className="flex items-center text-green-500 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                24%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Revenue</p>
                  <h3 className="text-2xl font-bold">$3350</h3>
                </div>
              </div>
              <div className="flex items-center text-green-500 text-sm font-medium">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                18%
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Weekly Orders</CardTitle>
                <CardDescription>Number of orders placed per day this week</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>Breakdown of user types in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {userTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Revenue generated over the past month</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Authorization Status</CardTitle>
                <CardDescription>Authorized vs. Unauthorized entities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Drivers</h4>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Authorized: 75%</span>
                      <span>Unauthorized: 25%</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Hotels</h4>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: "90%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Authorized: 90%</span>
                      <span>Unauthorized: 10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
