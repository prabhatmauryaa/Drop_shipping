"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User, ShoppingBag, MapPin, Package, Clock, ShieldCheck,
  LogOut, Star, Repeat, X, AlertTriangle, CheckCircle2, Lock, ArrowLeft, Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import FeedbackPopup from "../../components/FeedbackPopup";
import TrackingPopup from "../../components/TrackingPopup";

// ─── Order Address Change Modal ─────────────────────────────────────────────
function OrderAddressModal({ order, onClose, onSaved }) {
  const [form, setForm] = useState({
    street: order?.shippingAddress?.address || "",
    city: order?.shippingAddress?.city || "",
    postalCode: order?.shippingAddress?.postalCode || "",
    country: order?.shippingAddress?.country || "India",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.street.trim()) e.street = "Street address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.postalCode.trim()) e.postalCode = "Postal code is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("dropsync_token");
      await axios.put(
        `http://localhost:5000/api/orders/${order._id}/address`,
        {
          shippingAddress: {
            address: form.street,
            city: form.city,
            postalCode: form.postalCode,
            country: form.country,
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Doorstep address updated successfully!");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cannot change address after dispatch");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Modal Card */}
        <motion.div
          className="relative z-10 w-full max-w-lg"
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
          <div className="relative rounded-3xl overflow-hidden border border-blue-500/30 shadow-2xl shadow-blue-500/20">
            {/* Gradient top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            {/* Background glows */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            <div
              className="relative p-8"
              style={{ background: "rgba(15, 23, 42, 0.97)", backdropFilter: "blur(24px)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Change Delivery Address</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Order #{order._id.substring(0, 8)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Warning Banner */}
              <div className="mb-6 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-300 font-semibold text-sm">Address Change Policy</p>
                  <p className="text-amber-400/80 text-xs mt-0.5 leading-relaxed">
                    You can only change the delivery address <strong>before dispatch</strong>. Once your order is
                    dispatched, the address cannot be modified.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Street */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Street / Door Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.street}
                    onChange={e => setForm({ ...form, street: e.target.value })}
                    placeholder="e.g. 42, MG Road, Sector 5"
                    className={`w-full bg-slate-900 border ${
                      errors.street ? "border-red-500" : "border-slate-700"
                    } rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                  />
                  {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street}</p>}
                </div>

                {/* City + Postal */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Mumbai"
                      className={`w-full bg-slate-900 border ${
                        errors.city ? "border-red-500" : "border-slate-700"
                      } rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Postal Code <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.postalCode}
                      onChange={e => setForm({ ...form, postalCode: e.target.value })}
                      placeholder="e.g. 400001"
                      className={`w-full bg-slate-900 border ${
                        errors.postalCode ? "border-red-500" : "border-slate-700"
                      } rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    />
                    {errors.postalCode && (
                      <p className="text-red-400 text-xs mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    value={form.country}
                    disabled
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Current Address Preview */}
              {order?.shippingAddress?.address && (
                <div className="mt-4 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Current address on file
                  </p>
                  <p className="text-sm text-slate-400">
                    {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-7">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {saving ? "Updating..." : "Update Address"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Return Request Modal ──────────────────────────────────────────────────
function ReturnModal({ order, onClose, onSubmitted }) {
  const [form, setForm] = useState({ reason: "", imageUrl: "" });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB Limit
        toast.error("File is too large. Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imageUrl: reader.result });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!form.reason.trim()) {
      toast.error("Please provide a reason for return");
      return;
    }
    if (!form.imageUrl) {
      toast.error("Please upload a photo of the product");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("dropsync_token");
      await axios.post(
        `http://localhost:5000/api/orders/${order._id}/return`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Return Request Submitted!");
      onSubmitted();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit return");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <motion.div className="relative z-10 w-full max-w-lg glass border border-red-500/30 rounded-3xl overflow-hidden p-8 shadow-2xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Repeat className="w-6 h-6 text-red-400" /> Return Request</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Reason for Return</label>
              <textarea 
                value={form.reason}
                onChange={e => setForm({ ...form, reason: e.target.value })}
                className="input-base min-h-[100px]" 
                placeholder="Why are you returning this? (e.g. Received wrong size, Item damaged during shipping...)" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Upload Photo Proof</label>
              <div className="relative group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden" 
                  id="return-photo-upload"
                />
                <label 
                  htmlFor="return-photo-upload"
                  className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-700 rounded-xl p-6 cursor-pointer group-hover:border-red-500/50 group-hover:bg-red-500/5 transition-all text-slate-400 group-hover:text-red-400"
                >
                  {preview ? (
                    <img src={preview} alt="Upload Preview" className="w-full max-h-40 object-contain rounded-lg shadow-lg" />
                  ) : (
                    <>
                       <div className="p-3 bg-slate-800 rounded-full group-hover:bg-red-500/20"><Plus className="w-6 h-6" /></div>
                       <span className="text-sm font-bold">Choose a Photo</span>
                       <span className="text-[10px] text-slate-500 uppercase tracking-widest">JPG, PNG strictly under 2MB</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={onClose} className="flex-1 py-3 text-slate-400 hover:text-white font-bold transition-all">Cancel</button>
            <button 
              onClick={handleSubmit} 
              disabled={loading}
              className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "Submit Return"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Feedback & Tracking popup states
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackOrderId, setFeedbackOrderId] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Address modal state
  const [addressModalOrder, setAddressModalOrder] = useState(null);
  const [returnModalOrder, setReturnModalOrder] = useState(null);

  // Track which orders have already had their address changed (one-time)
  const [changedOrders, setChangedOrders] = useState(new Set());

  useEffect(() => {
    // Load already-changed orders from localStorage
    const stored = JSON.parse(localStorage.getItem("dropsync_addr_changed_orders") || "[]");
    setChangedOrders(new Set(stored));

    const fetchCustomerData = async () => {
      try {
        const token = localStorage.getItem("dropsync_token");
        const storedUser = localStorage.getItem("dropsync_user");

        if (!token || !storedUser) {
          router.push("/login");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== "customer") {
          router.push("/admin/dashboard");
          return;
        }

        setUser(parsedUser);

        const res = await axios.get("http://localhost:5000/api/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("dropsync_token");
    localStorage.removeItem("dropsync_user");
    router.push("/login");
  };

  const triggerFeedback = (orderId) => {
    setFeedbackOrderId(orderId);
    setShowFeedback(true);
  };

  const handleReturnOrder = (order) => {
    setReturnModalOrder(order);
  };

  const refreshOrders = async () => {
     try {
      const token = localStorage.getItem("dropsync_token");
      const res = await axios.get("http://localhost:5000/api/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (_) {}
  };

  // Refresh orders after address is saved + lock that order
  const handleAddressSaved = async (orderId) => {
    // Mark this order as address-changed (one-time lock)
    const updated = new Set(changedOrders);
    updated.add(orderId);
    setChangedOrders(updated);
    localStorage.setItem("dropsync_addr_changed_orders", JSON.stringify([...updated]));
    refreshOrders();
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent flex rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative pt-24 px-4 md:px-10 pb-20 max-w-7xl mx-auto">
      <Toaster position="top-right" toastOptions={{ style: { background: "#1e293b", color: "#f8fafc", border: "1px solid #334155" } }} />
      <FeedbackPopup show={showFeedback} orderId={feedbackOrderId} onClose={() => setShowFeedback(false)} />
      <TrackingPopup show={!!trackingOrder} order={trackingOrder} onClose={() => setTrackingOrder(null)} />

      {/* Modals */}
      {addressModalOrder && (
        <OrderAddressModal
          order={addressModalOrder}
          onClose={() => setAddressModalOrder(null)}
          onSaved={() => handleAddressSaved(addressModalOrder._id)}
        />
      )}
      {returnModalOrder && (
        <ReturnModal 
          order={returnModalOrder}
          onClose={() => setReturnModalOrder(null)}
          onSubmitted={refreshOrders}
        />
      )}

      {/* Top Header with Back Button */}
      <div className="flex items-center justify-between mb-10">
        <button 
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold group"
        >
          <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </div>
          Back to Shopping
        </button>
        <div className="text-right">
           <h1 className="text-2xl font-black text-white">Member Center</h1>
           <p className="text-slate-500 text-sm">Managing your digital wardrobe</p>
        </div>
      </div>

      {/* Background glow */}
      <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row gap-8">

        {/* Left Sidebar Profile Section */}
        <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-3xl p-6 border border-slate-700/50 flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-primary opacity-20"></div>

            <div className="w-24 h-24 bg-slate-800 rounded-full border-4 border-slate-900 flex items-center justify-center mb-4 z-10 shadow-xl shadow-blue-500/10">
              <User className="w-10 h-10 text-blue-400" />
            </div>

            <h2 className="text-xl font-bold text-white mb-1 z-10">{user.name}</h2>
            <p className="text-sm text-slate-400 mb-4 z-10">{user.email}</p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20 z-10">
              <ShieldCheck className="w-4 h-4" /> Customer Account
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl border border-slate-700/50 overflow-hidden"
          >
            <div className="flex flex-col">
              <button className="flex items-center gap-3 p-4 bg-slate-800/50 text-white border-l-2 border-blue-500 hover:bg-slate-800 transition-colors text-sm font-medium">
                <ShoppingBag className="w-5 h-5 text-blue-400" /> My Orders
              </button>
              <button className="flex items-center gap-3 p-4 text-slate-400 hover:text-white hover:bg-slate-800/30 transition-colors text-sm font-medium border-t border-slate-800">
                <MapPin className="w-5 h-5" /> Saved Addresses
              </button>
            </div>
          </motion.div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-colors font-bold text-sm"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>

        {/* Right Main Content Section */}
        <div className="flex-1 space-y-8">

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-3xl border border-slate-700/50 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-slate-400 font-medium mb-1">Total Orders</p>
                <h3 className="text-3xl font-black text-white">{orders.length}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass p-6 rounded-3xl border border-slate-700/50 flex items-center justify-between"
            >
              <div>
                <p className="text-sm text-slate-400 font-medium mb-1">In Transit</p>
                <h3 className="text-3xl font-black text-white">
                  {orders.filter(o => o.status === "Dispatched" || o.status === "Out for Delivery").length}
                </h3>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
            </motion.div>
          </div>

          {/* Orders List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-3xl border border-slate-700/50 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-blue-400" /> Recent Orders
              </h3>
            </div>

            <div className="p-0">
              {orders.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center">
                  <Package className="w-16 h-16 text-slate-700 mb-4" />
                  <p className="text-slate-400 font-medium text-lg">No orders yet.</p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="p-6 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-white font-bold text-lg">
                            Order #{order._id.substring(0, 8)}
                          </span>
                          <span
                            className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                              order.status === "Delivered"
                                ? "bg-green-500/10 text-green-400"
                                : order.status === "Cancelled"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-blue-500/10 text-blue-400"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="text-sm font-bold text-slate-300 mt-2 mb-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                          {order.orderItems?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
                              <Package className="w-4 h-4 text-blue-400" />
                              <span>{item.qty}x {item.name}</span>
                            </div>
                          ))}
                        </div>

                        {/* Shipping address preview */}
                        {order.shippingAddress && (
                          <p className="text-xs text-slate-500 flex items-center gap-1 mb-1">
                            <MapPin className="w-3 h-3" />
                            {order.shippingAddress.address}, {order.shippingAddress.city}
                          </p>
                        )}

                        <p className="text-sm text-slate-400 mb-1">
                          Total:{" "}
                          <span className="text-green-400 font-medium">
                            ₹{order.totalPrice.toFixed(2)}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 md:items-end w-full md:w-auto">
                        <button
                          onClick={() => setTrackingOrder(order)}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl transition-all border border-slate-700"
                        >
                          Track Package
                        </button>

                        {order.status !== "Delivered" && order.status !== "Cancelled" && (
                          <div className="flex gap-2 w-full mt-2">
                            {changedOrders.has(order._id) ? (
                              // Already changed once — show locked badge
                              <div className="flex-1 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed">
                                <Lock className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-amber-400 text-xs font-semibold">Address Locked</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => setAddressModalOrder(order)}
                                className="flex-1 px-2 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-sm font-medium rounded-xl transition-all border border-blue-500/20 flex items-center justify-center gap-1"
                              >
                                <MapPin className="w-4 h-4" /> Change Address
                              </button>
                            )}
                          </div>
                        )}

                        {order.status === "Delivered" && (
                          <div className="flex gap-2 w-full mt-2">
                            <button
                              onClick={() => triggerFeedback(order._id)}
                              className="flex-1 px-2 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 text-sm font-medium rounded-xl transition-all border border-yellow-500/20 flex items-center justify-center gap-1"
                            >
                              <Star className="w-4 h-4" /> Rate
                            </button>

                            {!order.returnRequest?.isRequested ? (
                              <button
                                onClick={() => handleReturnOrder(order)}
                                className="flex-1 px-2 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-xl transition-all border border-red-500/20 flex items-center justify-center gap-1"
                              >
                                <Repeat className="w-4 h-4" /> Return
                              </button>
                            ) : (
                              <div className="flex-1 px-2 py-2 bg-slate-800 text-slate-400 text-sm font-medium rounded-xl border border-slate-700 flex items-center justify-center gap-1 cursor-not-allowed">
                                <Repeat className="w-4 h-4" /> {order.returnRequest.status}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
