"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Users, Search, Star, MessageSquare, LayoutDashboard } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api, { getErrorMessage } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SuppliersPage() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await api.get("/users/all");
        setSuppliers((res.data || []).filter((u) => u.role === "supplier"));
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    if (!searchQuery.trim()) return suppliers;
    const q = searchQuery.toLowerCase();
    return suppliers.filter((s) =>
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q)
    );
  }, [suppliers, searchQuery]);

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600">
            <Users className="w-7 h-7" />
          </div>
          Supplier Management
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Manage vendor supplier accounts, listings, and operational ratings.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Active Suppliers</h2>
            <p className="text-xs text-slate-500">Showing {filteredSuppliers.length} suppliers</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search suppliers..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 font-bold">Supplier Name</th>
                <th className="px-6 py-3.5 font-bold">Contact Email</th>
                <th className="px-6 py-3.5 font-bold">Performance Rating</th>
                <th className="px-6 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm">Loading suppliers...</p>
                  </td>
                </tr>
              ) : filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No active suppliers found.</p>
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((sup) => (
                  <tr key={sup._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{sup.name}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">ID: {sup._id}</div>
                      <div className="text-[11px] text-emerald-600 font-semibold tracking-wide mt-0.5">✓ Verified Merchant</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{sup.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <Star className="w-4 h-4 fill-amber-500" />
                        <Star className="w-4 h-4 fill-amber-500" />
                        <Star className="w-4 h-4 fill-amber-500" />
                        <Star className="w-4 h-4 fill-amber-500/40 text-amber-500" />
                        <span className="text-slate-500 ml-1.5 text-xs font-semibold">(4.8)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => router.push(`/admin/products?supplier=${sup._id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl transition-all"
                        title="View Supplier Products"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        View Products
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
