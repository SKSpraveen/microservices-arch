'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaMotorcycle, FaUser, FaClock, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import ProfilePage from './profile';
import AuthenticateData from './authenticationData';
import DriverHome from './DriverHome';
import VehicleProfilePage from './vehicle'
import DriverOrderHistoryPage from './driverOrderHistory'
import { useRouter } from 'next/navigation';

export default function DriverDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/50 dark:from-dark-900 dark:via-dark-900 dark:to-dark-800">
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-dark-800 shadow-md p-6 hidden md:flex flex-col justify-start rounded-r-2xl">
          <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-10">Hello Driver</h2>
          <nav className="flex flex-col space-y-8">
            <SidebarLink icon={<FaMotorcycle />} text="Dashboard" onClick={() => setActiveSection('dashboard')} />
            <SidebarLink icon={<FaUser />} text="Profile" onClick={() => setActiveSection('profile')} />
            <SidebarLink icon={<FaUser />} text="Vehicle Profile" onClick={() => setActiveSection('vehicle')} />
            <SidebarLink icon={<FaUser />} text="Order History" onClick={() => setActiveSection('orders')} />
          </nav>

          {/* Logout Button */}
          <button
  onClick={() => {
    const confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      sessionStorage.removeItem("userEmail");
      router.push("/signin");
    }
  }}
  className="mt-auto bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg font-semibold transition duration-200"
>
  Logout
</button>

        </aside>

        {/* Main Content */}
        <main className="flex-1 container mx-auto py-12 px-6">
          <div className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8">
            {activeSection === 'dashboard' && <DriverHome />}
            
            {activeSection === 'profile' && (
              <>
                <SectionHeader title="Driver Profile" />
                <ProfilePage />
              </>
            )}
            {activeSection === 'vehicle' && (
              <>
                <SectionHeader title="Vehicle Profile" />
                <VehicleProfilePage />
              </>
            )}

{activeSection === 'orders' && (
              <>
                <SectionHeader title="Order History" />
                <DriverOrderHistoryPage />
              </>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-dark-700 py-6 text-center text-gray-500 dark:text-gray-400 text-sm shadow-inner">
        © {new Date().getFullYear()} Your Company. All rights reserved.
      </footer>

    </div>
  );
}

function SidebarLink({ icon, text, onClick }: { icon: React.ReactNode; text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 font-medium transition"
    >
      {icon}
      <span className="text-lg">{text}</span>
    </button>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h1 className="text-3xl font-bold mb-8 text-primary-600 dark:text-primary-400">
      {title}
    </h1>
  );
}
