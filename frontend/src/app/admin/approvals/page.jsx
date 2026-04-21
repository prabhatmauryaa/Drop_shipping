"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { ShieldCheck, CheckCircle, XCircle, Package, User, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ApprovalsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      const token = localStorage.getItem("dropsync_token");
      const res = await axios.get("http://localhost:5000/api/products/admin/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to load pending products");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("dropsync_token");
      await axios.put(`http://localhost:5000/api/products/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Product approved successfully");
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      toast.error("Failed to approve product");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this product?")) return;
    try {
      const token = localStorage.getItem("dropsync_token");
      await axios.put(`http://localhost:5000/api/products/admin/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Product rejected");
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      toast.error("Failed to reject product");
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      
      <div className="mb-10">
        <button 
          onClick={() => router.push("/admin/dashboard")}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
           <ShieldCheck className="w-8 h-8 text-green-400" /> Pending Approvals
        </h1>
        <p className="text-slate-400 mt-2">Review and authorize new product listings from suppliers.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent flex rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="glass p-12 rounded-3xl border border-slate-700/50 text-center">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No products awaiting approval.</p>
          </div>
        ) : (
          products.map((product) => (
            <div key={product._id} className="glass p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package className="w-12 h-12 text-slate-600" /></div>
                )}
              </div>
              
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">{product.category}</span>
                    <h2 className="text-xl font-bold text-white mt-1">{product.title}</h2>
                  </div>
                  <div className="text-right text-green-400 font-black text-2xl">
                    ₹{product.price.toFixed(2)}
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">{product.description}</p>
                
                <div className="flex flex-wrap items-center gap-6 mt-auto pt-4 border-t border-slate-800/50">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Supplier: <span className="text-slate-200 font-medium">{product.supplier?.name || "Unknown"}</span> ({product.supplier?.email})</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Package className="w-4 h-4 text-slate-500" />
                    <span>Initial Stock: <span className="text-slate-200 font-medium">{product.stock} units</span></span>
                  </div>
                </div>
              </div>
              
              <div className="flex md:flex-col justify-center gap-3 md:w-40 border-l border-slate-800/50 pl-6">
                <button 
                  onClick={() => handleApprove(product._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/20 px-4 py-3 rounded-xl font-bold transition-all"
                >
                  <CheckCircle className="w-5 h-5" /> Approve
                </button>
                <button 
                  onClick={() => handleReject(product._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 px-4 py-3 rounded-xl font-bold transition-all"
                >
                  <XCircle className="w-5 h-5" /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
