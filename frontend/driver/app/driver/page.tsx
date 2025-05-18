'use client';
import React, { useState } from 'react';
import { FaMotorcycle, FaUser, FaClock, FaMapMarkerAlt,FaMoneyBillWave } from 'react-icons/fa';
import ProfilePage from './profile';

export default function DriverDashboard() {
  // Sample data - replace with actual API calls for drivers
  const driverStats = {
    totalDeliveries: 120,
    activeDeliveries: 10,
    averageDeliveryTime: "30 mins",
    todayEarnings: "$850"
  };

  const [activeSection, setActiveSection] = useState("dashboard"); // default is Profile

  const recentDeliveries = [
    { id: 1, driverName: "James Brown", status: "In Progress", time: "10:30 AM", location: "Downtown" },
    { id: 2, driverName: "Emily White", status: "Completed", time: "10:15 AM", location: "Uptown" },
    // Add more delivery records as needed
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <div className="mb-10">
          <h2 className="text-2xl font-bold">Hello Driver</h2>
        </div>
        <nav className="flex flex-col space-y-10">
          <SidebarLink icon={<FaMotorcycle />} text="Dashboard" onClick={() => setActiveSection("dashboard")} />
          <SidebarLink icon={<FaUser />} text="Profile" onClick={() => setActiveSection("profile")} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {activeSection === "profile" && (
          <>
            <h1 className="text-2xl font-bold mb-6">Driver Profile</h1>
           <ProfilePage/>
          </>
        )}

        {activeSection === "dashboard" && (
          <>
            <h1 className="text-2xl font-bold mb-6">Driver Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard
                icon={<FaMotorcycle />}
                title="Total Deliveries"
                value={driverStats.totalDeliveries}
                color="bg-blue-500"
              />
              <StatCard
                icon={<FaMotorcycle />}
                title="Active Deliveries"
                value={driverStats.activeDeliveries}
                color="bg-green-500"
              />
              <StatCard
                icon={<FaClock />}
                title="Avg. Delivery Time"
                value={driverStats.averageDeliveryTime}
                color="bg-yellow-500"
              />
              <StatCard
                icon={<FaMoneyBillWave />}
                title="Today's Earnings"
                value={driverStats.todayEarnings}
                color="bg-purple-500"
              />
            </div>

            {/* Recent Deliveries */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Deliveries</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left">Delivery ID</th>
                      <th className="px-6 py-3 text-left">Driver</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Time</th>
                      <th className="px-6 py-3 text-left">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDeliveries.map((delivery) => (
                      <tr key={delivery.id} className="border-t">
                        <td className="px-6 py-4">{delivery.id}</td>
                        <td className="px-6 py-4">{delivery.driverName}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            delivery.status === "Completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {delivery.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">{delivery.time}</td>
                        <td className="px-6 py-4">{delivery.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`${color} p-3 rounded-full text-white mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Sidebar Link Component
function SidebarLink({ icon, text, onClick }: { icon: React.ReactNode; text: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center space-x-3 text-gray-700 hover:text-blue-500 hover:font-semibold">
      {icon}
      <span>{text}</span>
    </button>
  );
}
