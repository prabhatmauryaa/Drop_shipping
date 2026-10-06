"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { ShoppingCart, Edit, Eye, Filter, Truck, CheckCircle, PackageCheck, Repeat, X } from "lucide-react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import api, { getImageUrl, getErrorMessage } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnLoading, setReturnLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      toast.success("Order status updated!");
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleReturnAction = async (orderId, action) => {
    setReturnLoading(true);
    try {
      const res = await api.put(`/orders/${orderId}/return-status`, { status: action });
      toast.success(`Return request ${action.toLowerCase()} successfully!`);
      setSelectedOrder(res.data);
      fetchOrders();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setReturnLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Forwarded":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Dispatched":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Out for Delivery":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-600">
            <ShoppingCart className="w-7 h-7" />
          </div>
          Orders & Fulfilment
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Review incoming customer orders, manage statuses, and resolve return requests.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500"/> Order Fulfilment Queue ({orders.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5 font-bold">Order ID</th>
                <th className="px-6 py-3.5 font-bold">Customer</th>
                <th className="px-6 py-3.5 font-bold">Total Price</th>
                <th className="px-6 py-3.5 font-bold">Fast Delivery</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 font-bold">Return Request</th>
                <th className="px-6 py-3.5 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm">Syncing orders...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">No customer orders assigned yet.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-slate-600 text-xs">
                      #{order._id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{order.user?.name || "Guest"}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">₹{(order.totalPrice || 0).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {order.isFastDelivery ? (
                        <span className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                          <Truck className="w-3.5 h-3.5"/> Yes
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {order.returnRequest?.isRequested ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                          <Repeat className="w-3 h-3"/> {order.returnRequest.status}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                        title="Manage Order"
                      >
                        <Edit className="w-4 h-4"/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Panel for Order Edit */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="absolute top-0 right-0 w-full md:w-[460px] h-full bg-white shadow-2xl z-50 overflow-y-auto p-6 border-l border-slate-200"
            >
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Manage Order Fulfilment</h2>
                  <p className="text-xs text-slate-400 font-mono">#{selectedOrder._id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
                  <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-1">Payment Method</p>
                  <div className="text-xs font-semibold text-indigo-700">
                    {selectedOrder.paymentMethod === "Razorpay" ? "Prepaid Online (Razorpay)" : "Cash on Delivery (COD)"}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 block">
                    Update Fulfilment Status
                  </label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Forwarded">Forwarded to Warehouse</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Order Items ({selectedOrder.orderItems?.length})</h3>
                  <div className="space-y-3">
                    {selectedOrder.orderItems?.map((item, idx) => (
                      <div key={idx} className="flex gap-3 p-2 bg-white rounded-xl border border-slate-200/80">
                        <img
                          src={getImageUrl(item.image || item.img || item.imageUrl)}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                          onError={(e) => { e.target.src = "/placeholder-product.svg"; }}
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${item.product}`}
                            className="text-xs font-bold text-slate-800 hover:text-indigo-600 truncate block transition-colors"
                          >
                            {item.name}
                          </Link>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-slate-500">Qty: {item.qty} {item.size ? `• ${item.size}` : ""}</span>
                            <span className="text-xs font-bold text-slate-900">₹{(item.price || 0).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Destination Address</h3>
                  <p className="text-xs text-slate-600 bg-white border border-slate-200 rounded-xl p-3 leading-relaxed">
                    {selectedOrder.shippingAddress?.address ? (
                      `${selectedOrder.shippingAddress.address}, ${selectedOrder.shippingAddress.city || ""}, ${selectedOrder.shippingAddress.postalCode || ""}, ${selectedOrder.shippingAddress.country || "India"}`
                    ) : (
                      "No detailed address provided."
                    )}
                  </p>
                </div>

                {selectedOrder.returnRequest?.isRequested && (
                  <div className="border border-rose-200 rounded-2xl p-4 bg-rose-50/50">
                    <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Repeat className="w-3.5 h-3.5" /> Return / Refund Claim
                    </h3>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Claim Status:</span>
                        <span className="font-bold text-rose-700">{selectedOrder.returnRequest.status}</span>
                      </div>
                      <p className="text-xs text-slate-700 bg-white border border-rose-200 rounded-xl p-2.5">
                        <span className="font-semibold text-slate-500">Reason: </span>
                        {selectedOrder.returnRequest.reason}
                      </p>
                    </div>

                    {selectedOrder.returnRequest.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReturnAction(selectedOrder._id, "Approved")}
                          disabled={returnLoading}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve Refund
                        </button>
                        <button
                          onClick={() => handleReturnAction(selectedOrder._id, "Rejected")}
                          disabled={returnLoading}
                          className="flex-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                        >
                          Reject Claim
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-2 bg-white rounded-xl border border-slate-200">
                        <p className="text-xs text-slate-600 font-semibold">
                          Claim has been resolved as <span className="font-bold text-slate-900">{selectedOrder.returnRequest.status}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
