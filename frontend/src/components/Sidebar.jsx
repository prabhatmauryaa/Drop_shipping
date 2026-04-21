"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut, ShieldCheck, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("dropsync_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      router.push("/login"); // Secure redirect if not logged in
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("dropsync_token");
    localStorage.removeItem("dropsync_user");
    router.push("/login");
  };

  if (!user) return null;

  const navLinks = [
    { name: "Dashboard", href: `/${user.role}/dashboard`, icon: <LayoutDashboard className="w-5 h-5" />, roles: ["admin", "supplier"] },
    { name: "Products", href: `/${user.role}/products`, icon: <Package className="w-5 h-5" />, roles: ["admin", "supplier"] },
    { name: "Users & Roles", href: `/${user.role}/users`, icon: <Users className="w-5 h-5" />, roles: ["admin"] },
    { name: "Suppliers", href: `/${user.role}/suppliers`, icon: <Package className="w-5 h-5 text-indigo-400" />, roles: ["admin"] },
    { name: "Orders", href: `/${user.role}/orders`, icon: <ShoppingCart className="w-5 h-5" />, roles: ["admin", "supplier"] },
    { name: "Product Approvals", href: `/${user.role}/approvals`, icon: <ShieldCheck className="w-5 h-5 text-green-400" />, roles: ["admin"] },
    { name: "Settings", href: `/${user.role}/settings`, icon: <Settings className="w-5 h-5" />, roles: ["admin", "supplier"] },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 h-screen fixed top-0 left-0 flex flex-col hidden md:flex">
      <div className="p-6">
        <div className="flex items-center gap-2 text-2xl font-bold text-foreground cursor-pointer" onClick={() => router.push("/")}>
          <ShieldCheck className="text-blue-500 w-8 h-8" />
          <span className="text-gradient">Vastra culture</span>
        </div>
        <p className="text-xs text-slate-500 mt-2 uppercase tracking-wider font-semibold">
          {user.role} Panel
        </p>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-4">
        {navLinks
          .filter(link => link.roles.includes(user.role))
          .map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link key={link.name} href={link.href}>
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  {link.icon}
                  <span className="font-medium text-sm">{link.name}</span>
                </motion.div>
              </Link>
            );
          })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-4">
          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
          <p className="text-xs text-slate-400 truncate">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors font-medium text-sm"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );
}
