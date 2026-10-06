"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "../../../components/AdminLayout";
import { motion } from "framer-motion";
import {
  Users,
  PackageOpen,
  LayoutDashboard,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Repeat,
  PackageCheck,
  Star,
  Plus,
  Clock,
  CheckCircle,
  MapPin
} from "lucide-react";
import api, { getErrorMessage } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

export default function SupplierDashboardPage() {
  const router = useRouter();
  const urlRole = 'supplier';

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    activeOrders: 0,
    pendingApprovals: 0
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
        const user = storedUser ? JSON.parse(storedUser) : {};

        const [usersRes, productsRes, ordersRes, reviewsRes] = await Promise.all([
          user.role === 'admin' ? api.get("/users/all").catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
          api.get("/products/dashboard").catch(() => ({ data: [] })),
          api.get("/orders").catch(() => ({ data: [] })),
          api.get("/reviews/dashboard-reviews").catch(() => ({ data: [] }))
        ]);

        const orders = ordersRes.data || [];
        let sales = 0;
        let pending = 0;

        orders.forEach((o) => {
          if (o.status !== "Cancelled") sales += o.totalPrice || 0;
          if (["Pending", "Forwarded", "Dispatched", "Out for Delivery"].includes(o.status)) pending++;
        });

        const isSupplier = user.role === 'supplier';

        setStats({
          totalUsers: usersRes.data?.length || 0,
          totalProducts: productsRes.data?.length || 0,
          totalSales: sales,
          activeOrders: pending,
          pendingApprovals: isSupplier ? (productsRes.data || []).filter((p) => p.status === "pending").length : 0
        });

        setRecentOrders(orders.slice(-5).reverse());
        setReviews(reviewsRes.data || []);

        if (isSupplier) {
          setSupplierProducts(productsRes.data || []);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const updateLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser");
      return;
    }
    setIsUpdatingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.put("/users/location", {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
          toast.success("Supplier warehouse location updated successfully!");
        } catch (err) {
          toast.error(getErrorMessage(err));
        } finally {
          setIsUpdatingLocation(false);
        }
      },
      () => {
        toast.error("Location permission denied");
        setIsUpdatingLocation(false);
      }
    );
  };

  const getCards = () => {
    return [
      {
        title: "My Products",
        value: stats.totalProducts,
        icon: <PackageOpen className="w-5 h-5 text-indigo-600" />,
        bgColor: "bg-indigo-50 border-indigo-200",
        trend: "Active",
        up: true,
        href: "/supplier/products"
      },
      {
        title: "Dispatched Revenue",
        value: `₹${stats.totalSales.toFixed(2)}`,
        icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
        bgColor: "bg-emerald-50 border-emerald-200",
        trend: "Income",
        up: true
      },
      {
        title: "Active Orders",
        value: stats.activeOrders,
        icon: <ShoppingBag className="w-5 h-5 text-blue-600" />,
        bgColor: "bg-blue-50 border-blue-200",
        trend: "To Ship",
        up: true,
        href: "/supplier/orders"
      },
      {
        title: "Pending Approval",
        value: stats.pendingApprovals,
        icon: <Clock className="w-5 h-5 text-amber-600" />,
        bgColor: "bg-amber-50 border-amber-200",
        trend: "Under Review",
        up: false
      },
    ];
  };

  const cards = getCards();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600">
              <LayoutDashboard className="w-7 h-7" />
            </div>
            Supplier Control Hub
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Real-time inventory management, order dispatch, and earnings overview.</p>
        </div>

        <button
          onClick={updateLocation}
          disabled={isUpdatingLocation}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-indigo-500 hover:text-indigo-600 shadow-sm transition-all font-semibold text-xs"
        >
          <MapPin className={`w-4 h-4 text-indigo-600 ${isUpdatingLocation ? 'animate-bounce' : ''}`} />
          {isUpdatingLocation ? "Detecting GPS..." : "Update Warehouse Location"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            onClick={() => card.href && router.push(card.href)}
            className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
              card.href ? "cursor-pointer hover:border-indigo-300" : ""
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl border ${card.bgColor}`}>{card.icon}</div>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                card.up ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-amber-700 bg-amber-50 border border-amber-200"
              }`}>
                {card.trend} {card.up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              </div>
            </div>
            <div>
              <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{card.title}</h3>
              <p className="text-2xl font-black text-slate-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Customer Ratings & Feedback</h3>
              <p className="text-xs text-slate-500">Live feedback across your supplied items</p>
            </div>
            {reviews.length > 0 && (
              <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />{" "}
                {(reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)} Avg
              </span>
            )}
          </div>

          {reviews.length === 0 ? (
            <div className="flex-1 rounded-xl flex items-center justify-center flex-col text-slate-400 bg-slate-50 border border-dashed border-slate-200">
              <Star className="w-10 h-10 text-slate-300 mb-2 stroke-[1.5]" />
              <p className="text-sm font-medium">No reviews logged yet.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[350px]">
              {reviews.map((review, i) => (
                <div key={i} className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-xl flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">{review.user?.name || "Customer"}</span>
                    <div className="flex items-center text-amber-500 gap-1 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500" /> {review.rating}/5
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">"{review.comment}"</p>
                  <p className="text-[10px] text-slate-400 uppercase mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[400px]">
          <div className="mb-5 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Recent Order Activity</h3>
            <p className="text-xs text-slate-500">Latest orders routed for fulfilment</p>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <ShoppingBag className="w-10 h-10 text-slate-300 mb-2 stroke-[1.5]" />
              <p className="text-sm font-medium">No recent orders.</p>
            </div>
          ) : (
            <ul className="space-y-4 flex-1 overflow-y-auto pr-1 max-h-[350px]">
              {recentOrders.map((order) => (
                <li key={order._id} className="flex gap-3.5 border-b border-slate-100 pb-3.5 last:border-0 last:pb-0">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-200">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {order.user?.name || "Customer"} placed an order
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Status: <span className="font-semibold text-slate-700">{order.status}</span> •{" "}
                      <span className="text-emerald-600 font-bold">₹{(order.totalPrice || 0).toFixed(2)}</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Supplier Products Quick View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <PackageOpen className="w-6 h-6 text-indigo-600" /> Catalog Overview
            </h2>
            <p className="text-xs text-slate-500">Live breakdown between pending approval and active catalog</p>
          </div>
          <button
            onClick={() => router.push("/supplier/products")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" /> Manage All Products
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200/80">
              <Clock className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Awaiting Admin Approval</h3>
            </div>
            {(supplierProducts || []).filter((p) => p.status === 'pending').length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                All submitted products have been reviewed.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(supplierProducts || []).filter((p) => p.status === 'pending').map((product) => (
                  <div key={product._id} className="bg-white border border-amber-200/70 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-xs line-clamp-1">{product.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">₹{(product.price || 0).toFixed(2)}</p>
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200/80">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Live Active Products</h3>
            </div>
            {(supplierProducts || []).filter((p) => p.status === 'approved' || p.status === 'active').length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                No active products yet. Add your first item.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {(supplierProducts || []).filter((p) => p.status === 'approved' || p.status === 'active').map((product) => (
                  <div key={product._id} className="bg-white border border-emerald-200/70 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-slate-800 text-xs line-clamp-1">{product.title}</h4>
                      <p className="text-[11px] text-emerald-600 font-bold">₹{(product.price || 0).toFixed(2)}</p>
                    </div>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
