'use client';
import React from 'react';
import { FaMotorcycle, FaClock, FaMoneyBillWave } from 'react-icons/fa';

export default function DriverHome() {
  const driverStats = {
    totalDeliveries: 120,
    activeDeliveries: 10,
    averageDeliveryTime: '30 mins',
    todayEarnings: '$850',
  };

  const recentDeliveries = [
    { id: 1, driverName: 'James Brown', status: 'In Progress', time: '10:30 AM', location: 'Downtown' },
    { id: 2, driverName: 'Emily White', status: 'Completed', time: '10:15 AM', location: 'Uptown' },
  ];

  return (
    <>
      <SectionHeader title="Driver Dashboard" />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          icon={<FaMotorcycle />}
          title="Total Deliveries"
          value={driverStats.totalDeliveries}
          color="bg-primary-500"
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

      {/* Recent Deliveries Table */}
      <div className="bg-white dark:bg-dark-700 rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Recent Deliveries</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-700 dark:text-gray-300">
            <thead>
              <tr className="bg-gray-100 dark:bg-dark-600">
                <th className="px-6 py-3 text-left">Delivery ID</th>
                <th className="px-6 py-3 text-left">Driver</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Time</th>
                <th className="px-6 py-3 text-left">Location</th>
              </tr>
            </thead>
            <tbody>
              {recentDeliveries.map((delivery) => (
                <tr key={delivery.id} className="border-t dark:border-gray-700">
                  <td className="px-6 py-4">{delivery.id}</td>
                  <td className="px-6 py-4">{delivery.driverName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      delivery.status === 'Completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300'
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
  );
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string | number; color: string }) {
  return (
    <div className="flex items-center p-6 rounded-2xl bg-gray-100 dark:bg-dark-700 shadow hover:shadow-lg transition">
      <div className={`${color} p-3 rounded-full text-white mr-4`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 dark:text-gray-400 text-sm">{title}</h3>
        <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h1 className="text-3xl font-bold mb-8 text-primary-600 dark:text-primary-400">
      {title}
    </h1>
  );
}
