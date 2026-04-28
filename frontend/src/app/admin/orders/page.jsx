"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import Link from "next/link";
import { ShoppingCart, Edit, Eye, Filter, Truck, CheckCircle, PackageCheck, Repeat, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function OrdersPage() {
 const [orders, setOrders] = useState([]);
 const [loading, setLoading] = useState(true);
 const [selectedOrder, setSelectedOrder] = useState(null);

 const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150?text=No+Image";
    if (url.startsWith("http")) return url;
    const baseUrl = "http://localhost:5000";
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
  };

 const fetchOrders = async () => {
 try {
 const token = localStorage.getItem("dropsync_token");
 const res = await axios.get("http://localhost:5000/api/orders", {
 headers: { Authorization: `Bearer ${token}` }
 });
 setOrders(res.data);
 } catch (error) {
 toast.error("Failed to load orders");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => { fetchOrders(); }, []);

 const updateStatus = async (id, newStatus) => {
 try {
 const token = localStorage.getItem("dropsync_token");
 await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status: newStatus }, {
 headers: { Authorization: `Bearer ${token}` }
 });
 toast.success("Order status updated!");
 fetchOrders();
 setSelectedOrder(null);
 } catch (err) {
 toast.error("Status update failed");
 }
 };

 const getStatusColor = (status) => {
 switch(status) {
 case "Pending": return "bg-yellow-500/10 text-yellow-500";
 case "Forwarded": return "bg-blue-500/10 text-blue-400"; // case "Dispatched": return "bg-indigo-500/10 text-indigo-400";
 case "Out for Delivery": return "bg-orange-500/10 text-orange-400";
 case "Delivered": return "bg-green-500/10 text-green-500";
 case "Cancelled": return "bg-red-500/10 text-red-500";
 default: return "bg-slate-500/10 text-slate-400";
 }
 };

 return (
 <AdminLayout>
 <Toaster position="top-right" />
 <div className="mb-8 flex justify-between items-center">
 <div>
 <h1 className="text-3xl font-bold text-white flex items-center gap-3">
 <ShoppingCart className="w-8 h-8 text-green-500" /> Order Management
 </h1>
 <p className="text-slate-400 mt-1">Track placements, forward to suppliers, manage returns.</p>
 </div>
 </div>

 <div className="glass rounded-2xl border border-slate-700/50 overflow-hidden">
 <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
 <h2 className="font-bold text-white text-lg flex items-center gap-2"><Filter className="w-5 h-5 text-slate-400"/> Order Logs</h2>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left text-sm whitespace-nowrap">
 <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
 <tr>
 <th className="px-6 py-4 font-semibold">Order ID</th>
 <th className="px-6 py-4 font-semibold">Customer</th>
 <th className="px-6 py-4 font-semibold">Total Price</th>
 <th className="px-6 py-4 font-semibold">Fast Delivery</th>
 <th className="px-6 py-4 font-semibold">Status</th>
 <th className="px-6 py-4 font-semibold">Return Request</th>
 <th className="px-6 py-4 text-right">Action</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-800/50">
 {loading ? (
 <tr><td colSpan="7" className="px-6 py-10 text-center text-slate-500">Syncing live orders...</td></tr>
 ) : orders.length === 0 ? (
 <tr><td colSpan="7" className="px-6 py-10 text-center text-slate-500">No orders found.</td></tr>
 ) : orders.map(order => (
 <tr key={order._id} className="hover:bg-slate-800/30 transition-colors">
 <td className="px-6 py-4 font-medium text-slate-300">#{order._id.substring(0, 8)}</td>
 <td className="px-6 py-4 text-white">{order.user?.name || "Guest"}</td>
 <td className="px-6 py-4 font-medium text-green-400">₹{order.totalPrice.toFixed(2)}</td>
 <td className="px-6 py-4">
 {order.isFastDelivery ? <span className="flex items-center gap-1 text-orange-400"><Truck className="w-4 h-4"/> Yes</span> : <span className="text-slate-500">Standard</span>}
 </td>
 <td className="px-6 py-4">
 <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
 {order.status}
 </span>
 </td>
 <td className="px-6 py-4">
 {order.returnRequest?.isRequested ? (
 <span className="flex items-center gap-1 text-red-400 font-medium"><Repeat className="w-4 h-4"/> {order.returnRequest.status}</span>
 ) : <span className="text-slate-600">None</span>}
 </td>
 <td className="px-6 py-4 text-right">
 <button onClick={() => setSelectedOrder(order)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="View Details"><Eye className="w-5 h-5"/></button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {/* Side Panel for Order Edit */}
 <AnimatePresence>
 {selectedOrder && (
 <motion.div 
 initial={{ x: 400, opacity: 0 }}
 animate={{ x: 0, opacity: 1 }}
 exit={{ x: 400, opacity: 0 }}
 className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-slate-900 border-l border-slate-700 shadow-2xl z-50 overflow-y-auto p-6"
 >
 <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
 <h2 className="text-xl font-bold text-white">Order Details</h2>
 <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">✕</button>
 </div>

 <div className="space-y-6">
 <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
 <p className="text-sm font-semibold text-slate-300 mb-2">Automated Supplier Forwarding</p>
 <div className="flex items-center gap-2 text-sm text-blue-400 bg-blue-500/10 p-2 rounded-lg">
 <PackageCheck className="w-5 h-5" /> Auto-assigned to respective suppliers.
 </div>
 </div>

 <div>
 <label className="text-sm text-slate-400 mb-1 block">Order Status</label>
 <div className="w-full bg-slate-800/50 border border-slate-700 text-slate-400 rounded-xl px-4 py-3 cursor-not-allowed font-semibold">
   {selectedOrder.status}
 </div>
 </div>

 <div className="border border-slate-700 rounded-xl p-4 bg-slate-800/30">
 <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">Order Items</h3>
 <div className="space-y-4">
 {selectedOrder.orderItems?.map((item, idx) => (
 <div key={idx} className="flex gap-4 p-2 rounded-lg hover:bg-slate-700/30 transition-colors border border-transparent hover:border-slate-700">
 <div className="relative group flex-shrink-0">
 <img 
 src={getImageUrl(item.image || item.img || item.imageUrl)} 
 alt={item.name} 
 className="w-16 h-16 object-cover rounded-lg border border-slate-700"
 onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=No+Image"; }}
 />
 </div>
 <div className="flex-1 min-w-0">
 <Link 
 href={`/product/${item.product}`} 
 className="text-sm font-semibold text-white hover:text-blue-400 truncate block transition-colors"
 >
 {item.name}
 </Link>
 <div className="flex justify-between items-center mt-1">
 <span className="text-xs text-slate-400">Qty: {item.qty}</span>
 <span className="text-xs font-bold text-green-400">₹{item.price.toFixed(2)}</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 <div className="border border-slate-700 rounded-xl p-4 bg-slate-800/30">
 <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">Doorstep Address <Edit className="w-3 h-3 text-slate-400"/></h3>
 <p className="text-xs text-slate-400 mb-2">Customers can change delivery address before dispatch.</p>
 <textarea disabled className="w-full bg-slate-900 border border-slate-700 text-slate-300 rounded-lg p-3 text-sm" value={`${selectedOrder.shippingAddress?.address}, ${selectedOrder.shippingAddress?.city}, ${selectedOrder.shippingAddress?.country}`} />
 </div>

 {selectedOrder.returnRequest?.isRequested && (
 <div className="border border-red-500/30 rounded-xl p-4 bg-red-900/10">
 <h3 className="text-sm font-bold text-red-400 mb-2">Refund Request </h3>
 <p className="text-xs text-slate-300">Reason: {selectedOrder.returnRequest.reason}</p>
 <div className="mt-3 text-center py-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5">
   <p className="text-xs text-amber-500 font-semibold italic">Awaiting supplier processing...</p>
 </div>
 </div>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </AdminLayout>
 );
}
