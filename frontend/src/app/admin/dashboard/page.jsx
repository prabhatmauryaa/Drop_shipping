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
  ShieldCheck,
  ArrowLeft
} from "lucide-react";
import api, { getErrorMessage } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, ordersRes, reviewsRes] = await Promise.all([
          api.get("/users/all").catch(() => ({ data: [] })),
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

        setStats({
          totalUsers: usersRes.data.length || 0,
          totalProducts: productsRes.data.length || 0,
          totalSales: sales,
          activeOrders: pending,
          pendingApprovals: (productsRes.data || []).filter((p) => p.status === "pending").length
        });

        setRecentOrders(orders.slice(-5).reverse());
        setReviews(reviewsRes.data || []);
      } catch (error) {
        console.error("Dashboard fetch error:", getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-50 border-blue-200",
      trend: "+12%",
      up: true,
      href: "/admin/users"
    },
    {
      title: "Active Products",
      value: stats.totalProducts,
      icon: <PackageOpen className="w-5 h-5 text-indigo-600" />,
      bgColor: "bg-indigo-50 border-indigo-200",
      trend: "+5%",
      up: true,
      href: "/admin/products"
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalSales.toFixed(2)}`,
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      bgColor: "bg-emerald-50 border-emerald-200",
      trend: "+24%",
      up: true
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: <ShieldCheck className="w-5 h-5 text-amber-600" />,
      bgColor: "bg-amber-50 border-amber-200",
      trend: "Action Required",
      up: false,
      href: "/admin/approvals"
    },
  ];

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
      <div className="mb-8">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-4 transition-colors text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Marketplace
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 rounded-2xl border border-indigo-100 text-indigo-600">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          Platform Overview
        </h1>
        <p className="text-slate-500 mt-1 text-sm">Welcome to your Vastra centralized command center.</p>
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

      {/* Reviews & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[420px]">
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Customer Feedback & Reviews</h3>
              <p className="text-xs text-slate-500">Live sentiment and feedback ratings</p>
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
              <p className="text-sm font-medium">No feedback received yet.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[380px]">
              {reviews.map((review, i) => (
                <div
                  key={i}
                  className="bg-slate-50/80 border border-slate-200/80 p-4 rounded-xl flex flex-col gap-1.5 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">{review.user?.name || "Customer"}</span>
                    <div className="flex items-center text-amber-500 gap-1 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      <Star className="w-3.5 h-3.5 fill-amber-500" /> {review.rating}/5
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">"{review.comment}"</p>
                  {review.description && <p className="text-xs text-indigo-600 mt-0.5">{review.description}</p>}
                  <p className="text-[10px] text-slate-400 uppercase mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[420px]">
          <div className="mb-5 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Recent Order Activity</h3>
            <p className="text-xs text-slate-500">Latest transactions across the store</p>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <ShoppingBag className="w-10 h-10 text-slate-300 mb-2 stroke-[1.5]" />
              <p className="text-sm font-medium">No recent activity detected.</p>
            </div>
          ) : (
            <ul className="space-y-4 flex-1 overflow-y-auto pr-1 max-h-[380px]">
              {recentOrders.map((order) => (
                <li key={order._id} className="flex gap-3.5 border-b border-slate-100 pb-3.5 last:border-0 last:pb-0">
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        order.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : order.status === "Cancelled" || order.returnRequest?.isRequested
                          ? "bg-rose-50 text-rose-600 border border-rose-200"
                          : "bg-indigo-50 text-indigo-600 border border-indigo-200"
                      }`}
                    >
                      {order.status === "Delivered" ? (
                        <PackageCheck className="w-4 h-4" />
                      ) : order.returnRequest?.isRequested ? (
                        <Repeat className="w-4 h-4" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
                      )}
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
    </AdminLayout>
  );
}
