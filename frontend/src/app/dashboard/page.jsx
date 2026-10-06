"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    User, ShoppingBag, MapPin, Package, Clock, ShieldCheck,
    LogOut, Star, Repeat, X, CheckCircle2, Lock, ArrowLeft, Zap
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import FeedbackPopup from "../../components/FeedbackPopup";
import TrackingPopup from "../../components/TrackingPopup";
import { api, getErrorMessage } from "@/lib/api";

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
            await api.put(`/orders/${order._id}/address`, {
                shippingAddress: {
                    address: form.street,
                    city: form.city,
                    postalCode: form.postalCode,
                    country: form.country,
                },
            });
            toast.success("Doorstep address updated successfully!");
            onSaved();
            onClose();
        } catch (err) {
            toast.error(getErrorMessage(err, "Cannot change address after dispatch"));
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Change Delivery Address</h3>
                            <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                                <Lock className="w-3 h-3" /> One-time order address modification
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Street Address *</label>
                        <input
                            type="text"
                            value={form.street}
                            onChange={(e) => setForm({ ...form, street: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-sm"
                        />
                        {errors.street && <p className="text-rose-600 text-xs mt-1">{errors.street}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">City *</label>
                            <input
                                type="text"
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-sm"
                            />
                            {errors.city && <p className="text-rose-600 text-xs mt-1">{errors.city}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Postal Code *</label>
                            <input
                                type="text"
                                value={form.postalCode}
                                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-sm"
                            />
                            {errors.postalCode && <p className="text-rose-600 text-xs mt-1">{errors.postalCode}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-7">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 disabled:opacity-60"
                    >
                        {saving ? "Updating..." : "Update Destination"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Return Request Modal ───────────────────────────────────────────────────
function ReturnModal({ order, onClose, onSubmitted }) {
    const [reason, setReason] = useState("");
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!reason) {
            toast.error("Please select a reason for return");
            return;
        }
        setSubmitting(true);
        try {
            await api.post(`/orders/${order._id}/return`, { reason, comment });
            toast.success("Return request submitted successfully");
            onSubmitted();
            onClose();
        } catch (err) {
            toast.error(getErrorMessage(err, "Failed to submit return request"));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Initiate Return Request</h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Reason for Return *</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white text-sm"
                        >
                            <option value="">Select a reason</option>
                            <option value="Damaged product">Damaged or defective product</option>
                            <option value="Wrong item received">Wrong item received</option>
                            <option value="Size issue">Incorrect size or fit</option>
                            <option value="Quality not as expected">Quality not as expected</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">Additional Comments</label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us more about the issue..."
                            rows="3"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white text-sm"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-7">
                    <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-100">
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-500/20 disabled:opacity-60"
                    >
                        {submitting ? "Submitting..." : "Submit Return"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Customer Dashboard Page ────────────────────────────────────────────────
export default function CustomerDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackOrderId, setFeedbackOrderId] = useState(null);
    const [trackingOrder, setTrackingOrder] = useState(null);
    const [addressModalOrder, setAddressModalOrder] = useState(null);
    const [returnModalOrder, setReturnModalOrder] = useState(null);
    const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
    const [changedOrders, setChangedOrders] = useState(new Set());

    useEffect(() => {
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
                    router.push(`/${parsedUser.role}/dashboard`);
                    return;
                }
                setUser(parsedUser);

                const res = await api.get("/orders/myorders");
                setOrders(res.data || []);

                const deliveredWithoutFeedback = res.data?.find(o => o.status === "Delivered" && !o.hasFeedback);
                if (deliveredWithoutFeedback) {
                    setFeedbackOrderId(deliveredWithoutFeedback._id);
                    setShowFeedback(true);
                }
            } catch (error) {
                toast.error(getErrorMessage(error, "Failed to load dashboard data"));
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
            const res = await api.get("/orders/myorders");
            setOrders(res.data || []);
        } catch (_) {}
    };

    const handleAddressSaved = async (orderId) => {
        const updated = new Set(changedOrders);
        updated.add(orderId);
        setChangedOrders(updated);
        localStorage.setItem("dropsync_addr_changed_orders", JSON.stringify([...updated]));
        refreshOrders();
    };

    const updateCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsUpdatingLocation(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                await api.put("/users/location", { lat: latitude, lng: longitude });
                toast.success("Home location updated for Quick Delivery!");
            } catch (err) {
                toast.error(getErrorMessage(err, "Failed to update location"));
            } finally {
                setIsUpdatingLocation(false);
            }
        }, (error) => {
            toast.error("Location access not granted");
            setIsUpdatingLocation(false);
        });
    };

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-slate-50/50 pt-28 px-4 md:px-10 pb-20 max-w-7xl mx-auto font-sans">
            <Toaster position="top-right" />
            <FeedbackPopup show={showFeedback} orderId={feedbackOrderId} onClose={() => setShowFeedback(false)} />
            <TrackingPopup show={!!trackingOrder} order={trackingOrder} onClose={() => setTrackingOrder(null)} />

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

            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-bold text-sm"
                >
                    <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Back to Store
                </button>
                <div className="text-right">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Dashboard</h1>
                    <p className="text-slate-500 text-xs">Manage orders, delivery addresses, and fast tracking</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Left Profile Sidebar */}
                <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-blue-50 rounded-full border-2 border-blue-100 flex items-center justify-center mb-3 text-blue-600 shadow-xs">
                            <User className="w-8 h-8" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mb-0.5">{user.name}</h2>
                        <p className="text-xs text-slate-500 mb-3 truncate max-w-full">{user.email}</p>

                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-5">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified Customer
                        </div>

                        <button
                            onClick={updateCurrentLocation}
                            disabled={isUpdatingLocation}
                            className="w-full flex items-center justify-center gap-2 p-2.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 hover:bg-blue-100 transition-all text-xs font-bold cursor-pointer"
                        >
                            <MapPin className={`w-3.5 h-3.5 ${isUpdatingLocation ? 'animate-bounce' : ''}`} />
                            {isUpdatingLocation ? "Locating..." : "Set Home Location (5km Quick)"}
                        </button>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-200 hover:bg-rose-100 transition-colors font-bold text-sm cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                </div>

                {/* Right Orders Area */}
                <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Orders</p>
                                <h3 className="text-3xl font-black text-slate-900">{orders.length}</h3>
                            </div>
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 text-blue-600">
                                <Package className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">In Delivery</p>
                                <h3 className="text-3xl font-black text-slate-900">
                                    {orders.filter(o => o.status === "Dispatched" || o.status === "Out for Delivery" || o.status === "Processing").length}
                                </h3>
                            </div>
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100 text-purple-600">
                                <Clock className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-blue-600" /> Recent Purchases
                            </h3>
                            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Priority local dispatch active
                            </div>
                        </div>

                        <div className="p-0">
                            {orders.length === 0 ? (
                                <div className="p-16 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <p className="text-slate-800 font-bold text-base mb-1">No orders yet</p>
                                    <p className="text-slate-500 text-sm mb-4">Browse our catalog to make your first purchase</p>
                                    <button
                                        onClick={() => router.push("/products")}
                                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs"
                                    >
                                        Explore Products
                                    </button>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {orders.map((order) => (
                                        <div key={order._id} className="p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-slate-900 font-bold text-base">Order #{order._id.substring(0, 8)}</span>
                                                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                                                        order.status === "Delivered"
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                            : order.status === "Cancelled"
                                                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                                                            : "bg-blue-50 text-blue-700 border border-blue-200"
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                    {order.isFastDelivery && (
                                                        <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                                            ⚡ Quick Delivery
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="text-sm font-semibold text-slate-700 my-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                                                    {order.orderItems?.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 mb-1 last:mb-0">
                                                            <Package className="w-3.5 h-3.5 text-blue-600" />
                                                            <span>{item.qty}x {item.name} {item.size ? `[Size: ${item.size}]` : ""}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <p className="text-sm text-slate-500 mb-0.5">
                                                    Total: <span className="text-slate-900 font-bold">₹{(order.totalPrice || 0).toLocaleString()}</span>
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2 md:items-end w-full md:w-auto justify-center">
                                                <button
                                                    onClick={() => setTrackingOrder(order)}
                                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200 cursor-pointer"
                                                >
                                                    Track Delivery
                                                </button>

                                                {order.status === "Delivered" && (
                                                    <div className="flex gap-2 w-full mt-1">
                                                        {!order.hasFeedback ? (
                                                            <button
                                                                onClick={() => triggerFeedback(order._id)}
                                                                className="flex-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl border border-amber-200 flex items-center justify-center gap-1 cursor-pointer"
                                                            >
                                                                <Star className="w-3.5 h-3.5" /> Rate
                                                            </button>
                                                        ) : (
                                                            <div className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Rated
                                                            </div>
                                                        )}

                                                        {!order.returnRequest?.isRequested ? (
                                                            <button
                                                                onClick={() => handleReturnOrder(order)}
                                                                className="flex-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center justify-center gap-1 cursor-pointer"
                                                            >
                                                                <Repeat className="w-3.5 h-3.5" /> Return
                                                            </button>
                                                        ) : (
                                                            <div className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1">
                                                                {order.returnRequest.status}
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
                    </div>
                </div>
            </div>
        </div>
    );
}
