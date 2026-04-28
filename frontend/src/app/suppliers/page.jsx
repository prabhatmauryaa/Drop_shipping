"use client";

import React, { useEffect, useState } from "react";
import { Search, Zap, Star, ShieldCheck, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

import { useRouter } from "next/navigation";

export default function SuppliersDirectory() {
    const router = useRouter();
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/users/suppliers");
                const prodRes = await axios.get("http://localhost:5000/api/products");
                let suppliersData = res.data;

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
                    const supplierProducts = prodRes.data.filter(p => 
                        p.supplier && (p.supplier._id === s._id || p.supplier === s._id)
                    );
                    return {
                        ...s,
                        id: s._id || idx,
                        products: supplierProducts.length,
                        rating: 4.7 + (idx * 0.1 > 0.2 ? 0.2 : idx * 0.1),
                        location: s.location?.city ? `${s.location.city}, ${s.location.country || "IN"}` : "Verified Facility"
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
        <div className="min-h-screen w-full relative pt-24 px-6 md:px-10 max-w-7xl mx-auto mb-20">
            <div className="absolute top-[10%] right-[20%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Verified <span className="text-gradient">Suppliers</span></h1>
                <p className="text-lg text-slate-400">
                    Source from the highest-rated inventory holders in the Vastra culture network. We guarantee quality and lightning-fast fulfillment.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 text-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent flex mx-auto rounded-full animate-spin"></div></div>
                ) : suppliers.map((sup, idx) => (
                    <motion.div
                        key={sup.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass rounded-3xl p-8 border border-slate-700/50 flex flex-col md:flex-row gap-6 items-start hover:border-blue-500/50 transition-colors group cursor-pointer"
                        onClick={() => router.push(`/products?supplierId=${sup._id || sup.id}`)}

                    >
                        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700 font-black text-2xl text-blue-400">
                            {sup.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{sup.name}</h2>
                                <ShieldCheck className="w-5 h-5 text-green-400" />
                            </div>
                            <p className="text-slate-400 flex items-center gap-1 text-sm mb-4"><MapPin className="w-4 h-4" /> {sup.location}</p>

                            <div className="flex flex-wrap gap-4 mt-auto">
                                <div className="px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
                                    <p className="text-xs text-slate-500 mb-1">Items Synced</p>
                                    <p className="font-bold text-white">{sup.products}</p>

                                </div>
                                <div className="px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
                                    <p className="text-xs text-slate-500 mb-1">Performance </p>
                                    <p className="font-bold text-white flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {sup.rating}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
