"use client";

import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Users, Search, LayoutDashboard, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api, { getErrorMessage } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users/all");
        setUsers(res.data || []);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const q = searchQuery.toLowerCase();
    return users.filter((u) =>
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  return (
    <AdminLayout>
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600">
              <Users className="w-7 h-7" />
            </div>
            User Accounts
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Manage global customer, supplier, and administrator permissions.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Platform Accounts ({filteredUsers.length})</h2>
            <p className="text-xs text-slate-500">All registered users across roles</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email or role..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 font-bold">User Details</th>
                <th className="px-6 py-3.5 font-bold">Role</th>
                <th className="px-6 py-3.5 font-bold">Contact Email</th>
                <th className="px-6 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm">Loading platform accounts...</p>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No users found matching search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {user._id?.substring(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
                        user.role === 'admin'
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : user.role === 'supplier'
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{user.email}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {user.role === 'supplier' && (
                        <button
                          onClick={() => router.push(`/admin/products?supplier=${user._id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl transition-all"
                          title="View Supplier Products"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          View Products
                        </button>
                      )}
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
