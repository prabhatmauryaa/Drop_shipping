"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("dropsync_token");
    const storedUser = localStorage.getItem("dropsync_user");

    if (!token || !storedUser) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    
    // Strict access control: /admin routes only for admins (and legacy sellers)
    if (pathname.startsWith("/admin") && (user.role !== "admin" && user.role !== "seller")) {
      router.push(`/${user.role}/dashboard`);
      return;
    }

    if (user.role === "customer") {
      router.push("/dashboard");
      return;
    }

    setIsAuthorized(true);
  }, [router, pathname]);

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent flex rounded-full animate-spin"></div>
      </div>
    );
  }
  // A wrapper to handle the sidebar and layout structure for all admin/dashboard pages.
  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Mobile Header (Only visible on small screens) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-20">
          <div className="flex items-center gap-2 font-bold text-lg">
            <span className="text-gradient">Vastra culture</span>
          </div>
          <button className="text-slate-400 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 lg:p-10 relative overflow-y-auto">
          {/* Subtle background glow for premium feel */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />
          {children}
        </main>
      </div>
    </div>
  );
}
