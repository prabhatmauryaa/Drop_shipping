"use client";

import React, { useState, useEffect } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { ShieldCheck, CheckCircle, XCircle, Package, User, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api, { getImageUrl, getErrorMessage } from "@/lib/api";
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
      const res = await api.get("/products/admin/pending");
      setProducts(res.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/products/admin/approve/${id}`, {});
      toast.success("Product approved successfully");
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this product?")) return;
    try {
      await api.put(`/products/admin/reject/${id}`, {});
      toast.success("Product rejected");
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />

      <div className="mb-8">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
            <ShieldCheck className="w-7 h-7" />
          </div>
          Pending Approvals
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Review, verify and authorize new supplier product catalog submissions.</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {loading ? (
          <div className="flex justify-center p-20">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-sm">
            <Package className="w-14 h-14 text-slate-300 mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-base font-bold text-slate-800 mb-1">Queue is clear!</h3>
            <p className="text-slate-500 text-sm">No supplier products are currently awaiting admin approval.</p>
          </div>
        ) : (
          products.map((product) => {
            const displayImg = getImageUrl(product.imageUrl || (product.images && product.images[0]));
            return (
              <div
                key={product._id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6"
              >
                <div className="w-full md:w-48 h-48 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {displayImg ? (
                    <img
                      src={displayImg}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "/placeholder-product.svg"; }}
                    />
                  ) : (
                    <Package className="w-12 h-12 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <div>
                        <span className="text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                          {product.category}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 mt-2">{product.title}</h2>
                      </div>
                      <div className="text-right text-slate-900 font-black text-2xl">
                        ₹{(product.price || 0).toFixed(2)}
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm line-clamp-3 mb-4">{product.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Supplier: <strong className="text-slate-800 font-semibold">{product.supplier?.name || "Unknown"}</strong> ({product.supplier?.email || "N/A"})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>Initial Stock: <strong className="text-slate-800 font-semibold">{product.stock || 0} units</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col justify-center gap-3 md:w-44 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <button
                    onClick={() => handleApprove(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-sm transition-all"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(product._id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-4 py-3 rounded-xl font-bold text-sm transition-all"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
}
