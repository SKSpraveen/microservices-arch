
import { type SidebarNavItem, SidebarNav } from "@/components/sidebar-nav"
import Navbar from "./navbar"

interface ProfileSidebarProps {
  items: SidebarNavItem[]
}

const sidebarItems = [
  {
    title: "Account",
    href: "/profile",
    icon: <span className="text-lg">👤</span>, // Replace with actual icons
  },
  {
    title: "Orders",
    href: "/profile/orders",
    icon: <span className="text-lg">📦</span>,
  },
  {
    title: "Addresses",
    href: "/profile/addresses",
    icon: <span className="text-lg">📍</span>,
  },
  {
    title: "Payment",
    href: "/profile/payment",
    icon: <span className="text-lg">💳</span>,
  },

  {
    title: "Settings",
    href: "/profile/settings",
    icon: <span className="text-lg">⚙️</span>,
  },
];

export const ProfileSidebar = () => {
  return (
    <div className="flex flex-col space-y-6 border-r p-4 w-64">
      <SidebarNav items={sidebarItems} />
    </div>
  )
}

