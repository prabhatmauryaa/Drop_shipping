"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Users, Search, Star, MessageSquare, LayoutDashboard } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const token = localStorage.getItem("dropsync_token");
        const res = await axios.get("http://localhost:5000/api/users/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filter only suppliers for Module 4
        setSuppliers(res.data.filter(u => u.role === "supplier"));
      } catch (error) {
        toast.error("Failed to load suppliers");
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-500" /> Supplier Management
        </h1>
        <p className="text-slate-400 mt-1">Manage supplier profiles, ratings, and performance (Module 4).</p>
      </div>

      <div className="glass rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
          <h2 className="font-bold text-white text-lg">Active Suppliers</h2>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search suppliers..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Supplier Name</th>
                <th className="px-6 py-4 font-semibold">Contact Email</th>
                <th className="px-6 py-4 font-semibold">Products Synced</th>
                <th className="px-6 py-4 font-semibold">Performance Rating</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">Loading suppliers...</td></tr>
              ) : suppliers.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">No active suppliers found.</td></tr>
              ) : (
                suppliers.map(sup => (
                  <tr key={sup._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{sup.name}</div>
                      <div className="text-xs text-green-400 font-medium tracking-wide">Verified</div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{sup.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-slate-300">
                        Avg. 14 items
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400" />
                        <Star className="w-4 h-4 fill-yellow-400" />
                        <Star className="w-4 h-4 text-slate-700" />
                        <span className="text-slate-400 ml-2 text-xs">(4.2)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Message Supplier"><MessageSquare className="w-4 h-4" /></button>
                       <button 
                         onClick={() => router.push(`/admin/products?supplier=${sup._id}`)}
                         className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors" 
                         title="View Supplier Products"
                       >
                         <LayoutDashboard className="w-4 h-4" />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
