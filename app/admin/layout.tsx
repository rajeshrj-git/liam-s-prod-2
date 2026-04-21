"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, Package } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Orders", href: "/admin/orders", icon: <ShoppingBag size={20} /> },
    { name: "Customers", href: "/admin/customers", icon: <Users size={20} /> },
    { name: "Products", href: "/admin/dashboard", icon: <Package size={20} /> }, // Assuming products is managed in dashboard or separately
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 shrink-0">
        <div className="p-6 border-b border-gray-200">
          <Link href="/" className="font-serif font-bold text-xl text-accent">Liam's Admin</Link>
        </div>
        <div className="p-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive ? "bg-accent/10 text-accent" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
