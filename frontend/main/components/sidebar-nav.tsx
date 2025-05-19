"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/api";

export interface SidebarNavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();



  return (
    <nav className="grid gap-6">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center space-x-2 rounded-md p-2 text-sm font-medium  ${
            pathname === item.href
              ? "bg-secondary text-foreground dark:text-primary-600"
              : "text-muted-foreground dark:text-white hover:bg-secondary hover:text-foreground"
          }`}
        >
          {item.icon}
          <span>{item.title}</span>
        </Link>
      ))}
      {/* Logout Button */}
      <Link
        href="/"
        onClick={() => {
          localStorage.removeItem("userProfile");
          logout();
        }}
        className="flex dark:text-white items-center space-x-2 rounded-md p-2 text-sm font-medium text-muted-foreground "
      >
        <span>Logout</span>
      </Link>
    </nav>
  );
}