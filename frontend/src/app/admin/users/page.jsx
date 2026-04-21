"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Users, Search, Star, MessageSquare, LayoutDashboard, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("dropsync_token");
        const res = await axios.get("http://localhost:5000/api/users/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (error) {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
           <button 
             onClick={() => router.push("/admin/dashboard")}
             className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors text-sm font-medium group"
           >
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
           </button>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" /> User Management
          </h1>
          <p className="text-slate-400 mt-1">Manage global user accounts, roles, and platform permissions.</p>
        </div>
      </div>

      <div className="glass rounded-2xl border border-slate-700/50 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/30">
          <h2 className="font-bold text-white text-lg">Platform Accounts ({users.length})</h2>
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search users by name or email..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Contact Email</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500">Loading platform users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-500">No users found.</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white">{user.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium tracking-widest uppercase mt-0.5">ID: {user._id.substring(0, 8)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                        user.role === 'admin' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                        user.role === 'supplier' ? "bg-purple-500/10 text-purple-500 border-purple-500/20" :
                        "bg-blue-500/10 text-blue-500 border-blue-500/20"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{user.email}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                       {user.role === 'supplier' && (
                         <button 
                           onClick={() => router.push(`/admin/products?supplier=${user._id}`)}
                           className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors" 
                           title="View Supplier Products"
                         >
                           <LayoutDashboard className="w-4 h-4" />
                         </button>
                       )}
                       <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="View Profile"><MessageSquare className="w-4 h-4" /></button>
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
