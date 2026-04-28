"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { motion } from "framer-motion";
import { Users, PackageOpen, LayoutDashboard, ShoppingBag, ArrowUpRight, ArrowDownRight, DollarSign, Repeat, PackageCheck, Star, ShieldCheck, Plus, Trash2, Edit, Clock, CheckCircle, Info, MapPin } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function DashboardPage() {
    const router = useRouter();
    const urlRole = 'supplier'; // Hardcoded since we are in the supplier route

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalSales: 0,
        activeOrders: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [supplierProducts, setSupplierProducts] = useState([]);
    const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const storedUser = localStorage.getItem("dropsync_user");
                const user = JSON.parse(storedUser);
                const token = localStorage.getItem("dropsync_token");
                const headers = { Authorization: `Bearer ${token}` };

                const [usersRes, productsRes, ordersRes, reviewsRes] = await Promise.all([
                    user.role === 'admin' ? axios.get("http://localhost:5000/api/users/all", { headers }).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
                    axios.get("http://localhost:5000/api/products/dashboard", { headers }).catch(() => ({ data: [] })),
                    axios.get("http://localhost:5000/api/orders", { headers }).catch(() => ({ data: [] })),
                    axios.get("http://localhost:5000/api/reviews/dashboard-reviews", { headers }).catch(() => ({ data: [] }))
                ]);

                const orders = ordersRes.data || [];
                let sales = 0;
                let pending = 0;

                orders.forEach(o => {
                    if (o.status !== "Cancelled") sales += o.totalPrice;
                    if (["Pending", "Forwarded", "Dispatched", "Out for Delivery"].includes(o.status)) pending++;
                });

                const isSupplier = user.role === 'supplier';

                setStats({
                    totalUsers: usersRes.data.length || 0,
                    totalProducts: productsRes.data.length || 0,
                    totalSales: sales,
                    activeOrders: pending,
                    pendingApprovals: isSupplier ? (productsRes.data || []).filter(p => p.status === "pending").length : 0
                });

                setRecentOrders(orders.slice(-5).reverse());
                setReviews(reviewsRes.data || []);

                if (isSupplier) {
                    setSupplierProducts(productsRes.data || []);
                }
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const updateLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            return;
        }
        setIsUpdatingLocation(true);
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const token = localStorage.getItem("dropsync_token");
                await axios.put("http://localhost:5000/api/users/location",
                    { lat: pos.coords.latitude, lng: pos.coords.longitude },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Supplier warehouse location updated!");
            } catch (err) {
                toast.error("Failed to update warehouse location");
            } finally {
                setIsUpdatingLocation(false);
            }
        }, () => {
            toast.error("Permission denied");
            setIsUpdatingLocation(false);
        });
    };

    const getCards = () => {
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem("dropsync_user") : null;
        const loggedInUser = storedUser ? JSON.parse(storedUser) : { role: 'customer' };

        // Determine which set of cards to show. 
        // If the URL role is supplier, we show supplier stats, even if an admin is viewing it.
        const viewAsRole = urlRole || loggedInUser.role;

        if (viewAsRole === 'admin') {
            return [
                { title: "Total Users", value: stats.totalUsers, icon: <Users className="w-6 h-6 text-blue-500" />, trend: "+12%", up: true, href: "/admin/users" },
                { title: "Active Products", value: stats.totalProducts, icon: <PackageOpen className="w-6 h-6 text-purple-500" />, trend: "+5%", up: true, href: "/admin/products" },
                { title: "Total Revenue", value: `₹${stats.totalSales.toFixed(2)}`, icon: <DollarSign className="w-6 h-6 text-green-500" />, trend: "+24%", up: true },
                { title: "Pending Approvals", value: stats.pendingApprovals, icon: <ShoppingBag className="w-6 h-6 text-yellow-500" />, trend: "Review", up: false, href: "/admin/approvals" },
            ];
        } else {
            return [
                { title: "My Products", value: stats.totalProducts, icon: <PackageOpen className="w-6 h-6 text-indigo-500" />, trend: "Active", up: true, href: loggedInUser.role === 'admin' ? null : "/supplier/products" },
                { title: "My Sales", value: `₹${stats.totalSales.toFixed(2)}`, icon: <DollarSign className="w-6 h-6 text-emerald-500" />, trend: "Income", up: true },
                { title: "Active Orders", value: stats.activeOrders, icon: <ShoppingBag className="w-6 h-6 text-orange-500" />, trend: "To Ship", up: false, href: loggedInUser.role === 'admin' ? null : "/supplier/orders" },
                { title: "Pending Items", value: stats.pendingApprovals, icon: <Repeat className="w-6 h-6 text-amber-500" />, trend: "Wait Admin", up: false },
            ];
        }
    };

    const cards = getCards();

    if (loading) return <AdminLayout><div className="flex items-center justify-center min-h-[50vh]"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div></AdminLayout>;

    return (
        <AdminLayout>
            <Toaster position="top-right" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3 capitalize">
                        <LayoutDashboard className="w-8 h-8 text-blue-500" />
                        {urlRole ? `${urlRole} Dashboard` : "Platform Overview"}
                        {typeof window !== 'undefined' && localStorage.getItem('dropsync_user') && JSON.parse(localStorage.getItem('dropsync_user')).role === 'admin' && urlRole === 'supplier' && (
                            <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md border border-amber-500/20 ml-2">Read-Only View</span>
                        )}
                    </h1>
                    <p className="text-slate-400">Welcome to your Vastra culture centralized command center.</p>
                </div>
                {/* Hide action buttons if admin is viewing supplier dashboard */}
                {!(typeof window !== 'undefined' && localStorage.getItem('dropsync_user') && JSON.parse(localStorage.getItem('dropsync_user')).role === 'admin' && urlRole === 'supplier') && (
                    <button
                        onClick={updateLocation}
                        disabled={isUpdatingLocation}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all font-bold text-sm"
                    >
                        <MapPin className={`w-4 h-4 ${isUpdatingLocation ? 'animate-pulse' : ''}`} />
                        {isUpdatingLocation ? "Saving Location..." : "Update Warehouse Location"}
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {cards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        onClick={() => card.href && router.push(card.href)}
                        className={`glass p-6 rounded-2xl border border-slate-700/50 hover:border-slate-600 transition-all flex flex-col justify-between ${card.href ? 'cursor-pointer hover:bg-slate-800/40' : ''}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">{card.icon}</div>
                            <div className={`flex items-center gap-1 text-sm font-medium ${card.up ? "text-green-400" : "text-red-400"}`}>
                                {card.trend} {card.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-slate-400 text-sm font-medium mb-1">{card.title}</h3>
                            <p className="text-3xl font-bold text-white">{card.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass rounded-2xl border border-slate-700/50 p-6 min-h-[400px] flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[100px]"></div>
                    <div className="flex justify-between items-center mb-4 z-10 w-full">
                        <h3 className="text-lg font-bold text-white">Customer Feedback & Reviews</h3>
                        {reviews.length > 0 && (
                            <span className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-sm font-bold border border-yellow-500/20">
                                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {(reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)} Avg
                            </span>
                        )}
                    </div>
                    {reviews.length === 0 ? (
                        <div className="flex-1 border border-slate-700/50 rounded-xl flex items-center justify-center flex-col text-slate-500 bg-slate-800/20">
                            <p>No feedback received yet.</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                            {reviews.map((review, i) => (
                                <div key={i} className="bg-slate-800/40 border border-slate-700 p-4 rounded-xl flex flex-col gap-2 relative group hover:border-slate-500 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-200">{review.user?.name || "Customer"}</span>
                                        <div className="flex items-center text-yellow-400 gap-1 text-xs font-bold">
                                            <Star className="w-3.5 h-3.5 fill-yellow-400" /> {review.rating}/5
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-400 max-w-[90%]">"{review.comment}"</p>
                                    <p className="text-[10px] text-slate-500 uppercase mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="glass rounded-2xl border border-slate-700/50 p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6">Recent Order Activity</h3>
                    {recentOrders.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-slate-500"><p>No recent activity detected.</p></div>
                    ) : (
                        <ul className="space-y-5 flex-1 overflow-y-auto pr-2">
                            {recentOrders.map((order) => (
                                <li key={order._id} className="flex gap-4 border-b border-slate-800/50 pb-4 last:border-0 last:pb-0 group">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${order.status === "Delivered" ? "bg-green-500/20 text-green-400 border border-green-500/20" :
                                            order.status === "Cancelled" || order.returnRequest?.isRequested ? "bg-red-500/20 text-red-400 border border-red-500/20" :
                                                "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                                            }`}>
                                            {order.status === "Delivered" ? <PackageCheck className="w-4 h-4" /> :
                                                order.returnRequest?.isRequested ? <Repeat className="w-4 h-4" /> :
                                                    <ShoppingBag className="w-4 h-4" />}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-200">{order.user?.name || "Customer"} placed an order</p>
                                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                                            Status: <span className="font-medium text-slate-300">{order.status}</span> • {order.orderItems?.length} items • <span className="text-green-400">₹{order.totalPrice.toFixed(2)}</span>
                                        </p>
                                        <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-wide">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Supplier Section */}
            {(urlRole === 'supplier' || (typeof window !== 'undefined' && localStorage.getItem('dropsync_user') && JSON.parse(localStorage.getItem('dropsync_user')).role === 'supplier')) && (
                <div className="mt-10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3"><PackageOpen className="w-7 h-7 text-purple-500" /> My Products</h2>
                        {/* Hide Add Product if admin is viewing */}
                        {!(typeof window !== 'undefined' && localStorage.getItem('dropsync_user') && JSON.parse(localStorage.getItem('dropsync_user')).role === 'admin') && (
                            <button onClick={() => router.push("/supplier/products")} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all"><Plus className="w-5 h-5" /> Add Product</button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="glass rounded-2xl border border-slate-700/50 p-6">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
                                <Clock className="w-5 h-5 text-yellow-500" /><h3 className="text-lg font-bold text-white">Pending Approval</h3>
                            </div>
                            {(supplierProducts || []).filter(p => p.status === 'pending').length === 0 ? (
                                <div className="text-center py-8 text-slate-500"><p>No pending products.</p></div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {(supplierProducts || []).filter(p => p.status === 'pending').map(product => (
                                        <div key={product._id} className="bg-slate-800/40 border border-yellow-500/20 rounded-lg p-4 transition-colors">
                                            <h4 className="font-bold text-white line-clamp-1">{product.title}</h4>
                                            <p className="text-xs text-slate-400">₹{product.price}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="glass rounded-2xl border border-slate-700/50 p-6">
                            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
                                <CheckCircle className="w-5 h-5 text-green-500" /><h3 className="text-lg font-bold text-white">Active Products</h3>
                            </div>
                            {(supplierProducts || []).filter(p => p.status === 'approved' || p.status === 'active').length === 0 ? (
                                <div className="text-center py-8 text-slate-500"><p>No active products.</p></div>
                            ) : (
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {(supplierProducts || []).filter(p => p.status === 'approved' || p.status === 'active').map(product => (
                                        <div key={product._id} className="bg-slate-800/40 border border-green-500/20 rounded-lg p-4 transition-colors">
                                            <h4 className="font-bold text-white line-clamp-1">{product.title}</h4>
                                            <p className="text-xs text-green-400 font-semibold">₹{product.price}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
