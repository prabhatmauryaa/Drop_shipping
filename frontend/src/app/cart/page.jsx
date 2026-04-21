"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight, MapPin,
  ShieldCheck, Truck, Tag, X, CheckCircle2, AlertTriangle,
  Home, Package, ChevronRight, Edit3, Lock
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useCart } from "@/context/CartContext";

// ─── Address Change Modal ───────────────────────────────────────────────────
function AddressModal({ onClose, onSave, currentAddress }) {
  const [form, setForm] = useState({
    street: currentAddress?.street || "",
    city: currentAddress?.city || "",
    state: currentAddress?.state || "",
    zip: currentAddress?.zip || "",
    country: currentAddress?.country || "India",
  });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.street.trim()) e.street = "Street address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.zip.trim()) e.zip = "Postal code is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("dropsync_token");
      if (!token) { toast.error("Please login first"); return; }
      await axios.put("http://localhost:5000/api/users/address", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onSave(form);
      toast.success("Address saved successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save address");
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

            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

            <div
              className="relative p-8"
              style={{ background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(24px)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Change Delivery Address</h3>
                    <p className="text-xs text-amber-400 flex items-center gap-1 mt-0.5">
                      <Lock className="w-3 h-3" /> One-time change only
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
                  <p className="text-amber-300 font-semibold text-sm">Important Notice</p>
                  <p className="text-amber-400/80 text-xs mt-0.5 leading-relaxed">
                    You can change your delivery address only <strong>once</strong>. After saving, this address will be permanently locked for your orders.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Street Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.street}
                    onChange={e => setForm({ ...form, street: e.target.value })}
                    placeholder="e.g. 42, MG Road, Sector 5"
                    className={`w-full bg-slate-900 border ${errors.street ? "border-red-500" : "border-slate-700"} rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                  />
                  {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street}</p>}
                </div>

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
                      className={`w-full bg-slate-900 border ${errors.city ? "border-red-500" : "border-slate-700"} rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">State</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={e => setForm({ ...form, state: e.target.value })}
                      placeholder="e.g. Maharashtra"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Postal Code <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.zip}
                      onChange={e => setForm({ ...form, zip: e.target.value })}
                      placeholder="e.g. 400001"
                      className={`w-full bg-slate-900 border ${errors.zip ? "border-red-500" : "border-slate-700"} rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all`}
                    />
                    {errors.zip && <p className="text-red-400 text-xs mt-1">{errors.zip}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Country</label>
                    <input
                      type="text"
                      value={form.country}
                      disabled
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

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
                  {saving ? "Saving..." : "Save Address"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Cart Item Card ─────────────────────────────────────────────────────────
function CartItemCard({ item, onRemove, onQtyChange }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ type: "spring", damping: 20 }}
      className="flex gap-4 p-4 rounded-2xl border border-slate-700/60 bg-slate-800/40 backdrop-blur-sm hover:border-slate-600 transition-all group"
    >
      {/* Image */}
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex-shrink-0">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-slate-600" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-white text-sm md:text-base line-clamp-1 mb-1">{item.title}</h4>
        <span className="inline-block text-xs text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5 mb-3">
          {item.category}
        </span>
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Qty Controls */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
            <button
              onClick={() => onQtyChange(item._id, item.qty - 1)}
              disabled={item.qty <= 1}
              className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-white font-bold text-sm">{item.qty}</span>
            <button
              onClick={() => onQtyChange(item._id, item.qty + 1)}
              disabled={item.qty >= item.stock}
              className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Price */}
          <p className="text-green-400 font-black text-lg">₹{(item.price * item.qty).toFixed(2)}</p>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(item._id)}
        className="self-start w-9 h-9 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 flex items-center justify-center text-red-400 hover:text-red-300 transition-all flex-shrink-0"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ─── Main Cart Page ─────────────────────────────────────────────────────────
export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressChanged, setAddressChanged] = useState(false);
  const [savedAddress, setSavedAddress] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const changed = localStorage.getItem("dropsync_address_changed") === "true";
    setAddressChanged(changed);
    const addr = localStorage.getItem("dropsync_saved_address");
    if (addr) setSavedAddress(JSON.parse(addr));
  }, []);

  const handleRemove = (id) => {
    removeFromCart(id);
    toast.success("Item removed from cart");
  };

  const handleQtyChange = (id, newQty) => {
    if (newQty < 1) return;
    const item = cart.find(i => i.id === id);
    if (item && newQty > item.stock) {
      toast.error(`Only ${item.stock} units available`);
      return;
    }
    updateQuantity(id, newQty);
  };

  const handleAddressSave = (addr) => {
    setSavedAddress(addr);
    setAddressChanged(true);
    setShowAddressModal(false);
    localStorage.setItem("dropsync_address_changed", "true");
    localStorage.setItem("dropsync_saved_address", JSON.stringify(addr));
  };

  const handleCheckout = () => {
    if (cart.length === 0) { 
      toast.error("Your cart is empty"); 
      return; 
    }
    const token = localStorage.getItem("dropsync_token");
    if (!token) {
      toast.error("Please login to checkout");
      setTimeout(() => router.push("/login"), 1500);
      return;
    }
    // Store cart data for checkout and redirect
    localStorage.setItem("dropsync_checkout_cart", JSON.stringify(cart));
    router.push("/checkout");
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = 0;
  const total = subtotal + shipping;

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen w-full px-4 pb-20 pt-28 max-w-6xl mx-auto">
      <Toaster position="top-center" toastOptions={{ style: { background: "#1e293b", color: "#f8fafc", border: "1px solid #334155" } }} />

      {showAddressModal && (
        <AddressModal
          onClose={() => setShowAddressModal(false)}
          onSave={handleAddressSave}
          currentAddress={savedAddress}
        />
      )}

      {/* Background glows */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-blue-400" />
            </div>
            My Cart
          </h1>
          <p className="text-slate-400 text-sm mx-6 mt-4">{cart.length} item{cart.length !== 1 ? "s" : ""} in your cart</p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
        >
          Continue Shopping <ChevronRight className="w-4 h-4" />
        </button>
      </motion.div>

      {cart.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-2xl">
            <ShoppingCart className="w-12 h-12 text-slate-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Your cart is empty</h2>
          <p className="text-slate-400 mb-8 max-w-xs">Looks like you haven't added anything yet. Explore our products!</p>
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            Browse Products <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Cart Items + Address */}
          <div className="flex-1 space-y-5">
            {/* Cart Items */}
            <div className="glass rounded-3xl border border-slate-700/50 p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 pb-3 border-b border-slate-800">
                <Package className="w-5 h-5 text-blue-400" />
                Order Items
              </h2>
              <AnimatePresence mode="popLayout">
                <div className="space-y-3">
                  {cart.map(item => (
                    <CartItemCard
                      key={item._id}
                      item={item}
                      onRemove={handleRemove}
                      onQtyChange={handleQtyChange}
                    />
                  ))}
                </div>
              </AnimatePresence>
            </div>

            {/* Delivery Address Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-3xl border border-slate-700/50 p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Home className="w-5 h-5 text-purple-400" />
                  Delivery Address
                </h2>

                {!addressChanged ? (
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-3 py-1.5 rounded-xl transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Set Address
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl">
                    <Lock className="w-3 h-3" />
                    Address Locked
                  </div>
                )}
              </div>

              {savedAddress ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{savedAddress.street}</p>
                    <p className="text-slate-400 text-sm mt-0.5">
                      {[savedAddress.city, savedAddress.state, savedAddress.zip].filter(Boolean).join(", ")}
                    </p>
                    <p className="text-slate-500 text-sm">{savedAddress.country}</p>
                    {addressChanged && (
                      <p className="text-amber-400/80 text-xs mt-2 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        This address has been permanently set and cannot be changed again.
                      </p>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center gap-3 text-slate-400 py-2">
                  <MapPin className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="text-sm">No delivery address set.</p>
                    <p className="text-xs text-slate-500 mt-0.5">You can set your delivery address once. Choose carefully!</p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: "Secure Checkout", color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
                { icon: Truck, label: "Free Shipping", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                { icon: Tag, label: "Best Prices", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
              ].map(({ icon: Icon, label, color, bg, border }) => (
                <div key={label} className={`flex flex-col items-center gap-2 ${bg} border ${border} rounded-2xl p-3 text-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="text-xs font-semibold text-slate-300">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-80 xl:w-96 self-start sticky top-24"
          >
            <div className="glass rounded-3xl border border-slate-700/50 p-6 shadow-2xl overflow-hidden relative">
              {/* Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              {/* Top gradient bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

              <h2 className="text-lg font-bold text-white mb-5 pt-1">Order Summary</h2>

              {/* Item List Mini */}
              <div className="space-y-2 mb-5 max-h-48 overflow-y-auto pr-1">
                {cart.map(item => (
                  <div key={item._id} className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                      {item.imageUrl
                        ? <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.title} />
                        : <Package className="w-4 h-4 m-2 text-slate-600" />}
                    </div>
                    <span className="flex-1 text-slate-300 line-clamp-1">{item.title}</span>
                    <span className="text-white font-semibold flex-shrink-0">×{item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 mb-5 pb-5 border-b border-slate-800 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span className="text-white font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="text-green-400 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Taxes</span>
                  <span className="text-slate-300 font-semibold">Included</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-white font-bold text-lg">Total</span>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">₹{total.toFixed(2)}</span>
                  <p className="text-xs text-slate-500">All taxes included</p>
                </div>
              </div>

              {/* Savings badge */}
              {subtotal > 0 && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-5">
                  <Tag className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-xs font-semibold">
                    You save ₹{(subtotal * 0.23).toFixed(2)} compared to retail price!
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 rounded-2xl font-black text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/30 active:scale-[0.98]"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)" }}
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                256-bit SSL Secured Transaction
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
