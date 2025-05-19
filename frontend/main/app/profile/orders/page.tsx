"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [userProfile, setUserProfile] = useState<any>(null)
  useEffect(() => {
    // ✅ Safe localStorage access
    const storedProfile = localStorage.getItem("userProfile")
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile)
      setUserProfile(parsedProfile)

      // Fetch orders only after setting profile
      fetchOrders(parsedProfile._id)
    }
  }, [])

  const fetchOrders = async (userId: string) => {
    try {
      const res = await axios.get(`http://localhost:3000/order/orders/user/${userId}`)
      setOrders(res.data)
    } catch (err) {
      console.error("Failed to load orders:", err)
    }
  }
  const handleCancelOrder = async (orderId: any) => {
    try {
      await axios.post(`http://localhost:3000/order/orders/${orderId}/cancel`)
      setOrders((prev: any) =>
        prev.map((order: any) =>
          order._id === orderId ? { ...order, status: "canceled" } : order
        )
      )
    } catch (err) {
      alert("Failed to cancel order")
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div key={order._id} className="border p-4 rounded-md shadow-sm">
              <p>Order ID: {order._id}</p>
              <p>Status: {order.status}</p>
              <div className="flex gap-2 mt-2">
                <Link href={`orders/tracking/${order._id}`} className="text-blue-600 underline">
                  Track Order
                </Link>
                {order.status === "pending" && (
                  <button
                    onClick={() => window.confirm("Cancel this order?") && handleCancelOrder(order._id)}
                    className="text-red-600"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}