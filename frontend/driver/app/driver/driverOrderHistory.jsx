'use client';
import React, { useState, useEffect } from "react";

const DriverOrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy fetch simulation — replace with real API call
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Simulated delay
        await new Promise((res) => setTimeout(res, 1000));
        setOrders([
            { id: "ORD123", date: "2025-04-25", status: "Delivered", total: "Rs. 2,500" },
          { id: "ORD123", date: "2025-04-25", status: "Delivered", total: "Rs. 2,500" },
          { id: "ORD123", date: "2025-04-25", status: "Delivered", total: "Rs. 2,500" },
          { id: "ORD123", date: "2025-04-25", status: "Delivered", total: "Rs. 2,500" },
          { id: "ORD123", date: "2025-04-25", status: "Delivered", total: "Rs. 2,500" },
          { id: "ORD123", date: "2025-04-25", status: "Delivered", total: "Rs. 2,500" },
          { id: "ORD123", date: "2025-04-25", status: "Delivered", total: "Rs. 2,500" },
          { id: "ORD123", date: "2025-04-25", status: "Delivered", total: "Rs. 2,500" },
          { id: "ORD124", date: "2025-04-27", status: "Pending", total: "Rs. 1,200" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="flex max-h-screen flex-col bg-gradient-to-b from-background to-muted/50 dark:via-dark-900 dark:to-dark-800">
      <main className="container mx-auto flex-1 flex flex-col items-center justify-center py-20 px-4">
        <div className="w-full max-w-8xl bg-white dark:bg-dark-800 rounded-lg p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-center text-primary-600 dark:text-primary-400 mb-8">
            Order History
          </h1>

          {loading ? (
            <div className="text-center text-gray-500">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center text-gray-500">No orders found.</div>
          ) : (
            
            <div className="overflow-x-auto">
<div className="w-full mb-6">
  <div className="bg-white dark:bg-dark-700 shadow-md rounded-lg p-6 cursor-pointer transition-transform transform hover:scale-[1.01] hover:shadow-xl">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Current Order</h2>
    <div className="flex flex-wrap justify-between text-gray-700 dark:text-gray-300">
      <div className="mb-2">
        <span className="font-semibold">Order ID:</span> ORD-12345
      </div>
      <div className="mb-2">
        <span className="font-semibold">Status:</span> In Progress
      </div>
      <div className="mb-2">
        <span className="font-semibold">Delivery ETA:</span> April 30, 2025 – 3:45 PM
      </div>
      <div className="mb-2">
        <span className="font-semibold">Total:</span> LKR 4,500.00
      </div>
    </div>
  </div>
</div>

<div className="overflow-y-auto">
              <table className="min-w-full table-auto border-collapse text-gray-800 dark:text-white">
  <thead>
    <tr className="bg-gray-100 dark:bg-dark-700">
      <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
      <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
      <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
      <th className="px-6 py-3 text-left text-sm font-semibold">Total</th>
    </tr>
  </thead>
  <tbody>
    {orders.map((order) => (
      <tr
        key={order.id}
        className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-700"
      >
        <td className="px-6 py-4 text-sm">{order.id}</td>
        <td className="px-6 py-4 text-sm">{order.date}</td>
        <td className="px-6 py-4 text-sm">{order.status}</td>
        <td className="px-6 py-4 text-sm">{order.total}</td>
      </tr>
    ))}
  </tbody>
</table>
</div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DriverOrderHistoryPage;
