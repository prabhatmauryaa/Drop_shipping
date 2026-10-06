"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { Tag, PackageOpen, Search, ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api, { getImageUrl, getErrorMessage } from "@/lib/api";
import { useSearchParams, useRouter } from "next/navigation";

function AdminProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterSupplier = searchParams.get("supplier");

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [filterSupplier]);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/dashboard");
      let data = res.data || [];
      if (filterSupplier) {
        data = data.filter((p) => p.supplier === filterSupplier || p.supplier?._id === filterSupplier);
      }
      setProducts(data);
    } catch (error) {
      console.error("Product fetch error:", getErrorMessage(error));
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter((p) =>
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.supplier?.name?.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  return (
    <AdminLayout>
      <Toaster position="top-right" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          {filterSupplier && (
            <button
              onClick={() => router.push("/admin/products")}
              className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-2 transition-colors text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Show All Products (Clear Supplier Filter)
            </button>
          )}
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600">
              <PackageOpen className="w-7 h-7" />
            </div>
            Products Management
          </h1>
          <p className="text-slate-500 mt-1 text-sm">View and supervise all marketplace catalog listings.</p>
        </div>
      </div>

      {/* Products List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Product Inventory</h2>
            <p className="text-xs text-slate-500">Showing {filteredProducts.length} of {products.length} products</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, category, supplier..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 font-bold">Product Name</th>
                <th className="px-6 py-3.5 font-bold">Supplier</th>
                <th className="px-6 py-3.5 font-bold">Category</th>
                <th className="px-6 py-3.5 font-bold text-right">Price</th>
                <th className="px-6 py-3.5 text-center font-bold">Stock</th>
                <th className="px-6 py-3.5 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm">Loading inventory...</p>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No products match your search criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const displayImg = getImageUrl(product.imageUrl || (product.images && product.images[0]));
                  return (
                    <tr key={product._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {displayImg ? (
                            <img
                              src={displayImg}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = "/placeholder-product.svg"; }}
                            />
                          ) : (
                            <Tag className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 line-clamp-1 w-52">{product.title}</div>
                          <div className="text-xs text-slate-400 truncate w-52">{product.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {product.supplier?.name || "Vendor Supplier"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900 text-right">
                        ₹{(product.price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          (product.stock || 0) > 10
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          product.status === "approved" || product.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : product.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          {product.status || "pending"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">
        Loading inventory manager...
      </div>
    }>
      <AdminProductsContent />
    </Suspense>
  );
}
