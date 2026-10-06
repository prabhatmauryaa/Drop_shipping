"use client";

import React, { useEffect, useState } from "react";
import { Star, ShieldCheck, MapPin, Package } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function SuppliersDirectory() {
    const router = useRouter();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await api.get("/users/suppliers");
                const prodRes = await api.get("/products");
                let suppliersData = res.data || [];

                const ustr = localStorage.getItem("dropsync_user");
                if (ustr) {
                    try {
                        const pUser = JSON.parse(ustr);
                        if (pUser.role === 'supplier') {
                            suppliersData = suppliersData.filter(s => s._id === pUser.id || s._id === pUser._id || s.email === pUser.email);
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }

                const mapped = suppliersData.map((s, idx) => {
                    const supplierProducts = (prodRes.data || []).filter(p =>
                        p.supplier && (p.supplier._id === s._id || p.supplier === s._id)
                    );
                    return {
                        ...s,
                        id: s._id || idx,
                        products: supplierProducts.length,
                        rating: 4.7 + (idx * 0.1 > 0.2 ? 0.2 : idx * 0.1),
                        location: s.location?.city ? `${s.location.city}, ${s.location.country || "IN"}` : "Verified Warehouse Facility"
                    };
                });

                setSuppliers(mapped);
            } catch (err) {
                console.error("Failed to fetch suppliers", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSuppliers();
    }, []);

    return (
        <div className="min-h-screen w-full bg-slate-50/50 pt-28 px-4 sm:px-6 md:px-10 max-w-7xl mx-auto mb-20 font-sans">
            <div className="text-center mb-14 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-3">
                    <ShieldCheck className="w-4 h-4" /> 100% Verified Partners
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Our Verified Suppliers</h1>
                <p className="text-base text-slate-600 leading-relaxed">
                    Source directly from highest-rated factory inventory holders in the Vastra Culture network with guaranteed dispatch speed.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent mx-auto rounded-full animate-spin"></div>
                    </div>
                ) : suppliers.map((sup, idx) => (
                    <motion.div
                        key={sup.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all flex flex-col sm:flex-row gap-5 items-start group cursor-pointer"
                        onClick={() => router.push(`/products?supplierId=${sup._id || sup.id}`)}
                    >
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 font-black text-xl text-blue-600 shadow-xs flex-shrink-0">
                            {sup.name ? sup.name.substring(0, 2).toUpperCase() : "SP"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{sup.name}</h2>
                                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            </div>
                            <p className="text-slate-500 flex items-center gap-1.5 text-xs mb-4">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" /> {sup.location}
                            </p>

                            <div className="flex flex-wrap gap-3 mt-auto">
                                <div className="px-3.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <p className="text-[10px] font-bold uppercase text-slate-400">Products Listed</p>
                                    <p className="font-bold text-slate-900 text-sm flex items-center gap-1">
                                        <Package className="w-3.5 h-3.5 text-blue-600" /> {sup.products}
                                    </p>
                                </div>
                                <div className="px-3.5 py-1.5 bg-slate-50 rounded-xl border border-slate-200">
                                    <p className="text-[10px] font-bold uppercase text-slate-400">Rating Score</p>
                                    <p className="font-bold text-slate-900 text-sm flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> {sup.rating}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
