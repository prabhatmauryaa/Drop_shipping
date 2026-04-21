"use client";

import React, { useState } from "react";
import { Search, MapPin, Package, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [tracking, setTracking] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if(orderId.length > 5) setTracking(true);
  };

  return (
    <div className="min-h-[80vh] w-full pt-28 px-4 flex flex-col items-center">
      <div className="absolute top-[20%] right-[30%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-2xl w-full text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Track Your <span className="text-gradient">Package</span></h1>
        <p className="text-slate-400">Enter your order ID below to see real-time updates on your Vastra culture delivery.</p>
      </div>

      <div className="w-full max-w-2xl glass p-2 rounded-2xl border border-slate-700/50 flex items-center mb-16">
        <Search className="w-6 h-6 text-slate-500 ml-4" />
        <form onSubmit={handleTrack} className="flex-1 flex">
          <input 
            type="text" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. ORD-9823749823" 
            className="w-full bg-transparent border-none outline-none text-white px-4 py-3"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all">
            Track Start
          </button>
        </form>
      </div>

      {tracking && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl glass p-8 rounded-3xl border border-slate-700/50">
           <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
             <div>
               <p className="text-sm text-slate-400">Tracking Code</p>
               <h3 className="text-xl font-bold text-white uppercase">{orderId}</h3>
             </div>
             <div className="text-right">
               <p className="text-sm text-slate-400">Estimated Delivery</p>
               <h3 className="text-xl font-bold text-green-400">Tomorrow, 2:00 PM</h3>
             </div>
           </div>
           
           <div className="relative border-l-2 border-slate-800 ml-4 space-y-8 pb-4">
             <div className="relative pl-8">
                <div className="absolute -left-[11px] top-0.5 w-5 h-5 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center"><CheckCircle className="w-3 h-3 text-slate-900" /></div>
                <h4 className="text-white font-bold">Order Placed</h4>
                <p className="text-slate-400 text-sm">March 24, 2026 - 10:30 AM</p>
             </div>
             <div className="relative pl-8">
                <div className="absolute -left-[11px] top-0.5 w-5 h-5 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center"><CheckCircle className="w-3 h-3 text-slate-900" /></div>
                <h4 className="text-white font-bold">Forwarded to Supplier</h4>
                <p className="text-slate-400 text-sm">March 24, 2026 - 12:15 PM</p>
             </div>
             <div className="relative pl-8">
                <div className="absolute -left-[11px] top-0.5 w-5 h-5 bg-blue-500 rounded-full border-4 border-slate-900 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <h4 className="text-blue-400 font-bold">Out for Delivery</h4>
                <p className="text-slate-400 text-sm">March 25, 2026 - 08:45 AM (Currently active)</p>
             </div>
             <div className="relative pl-8">
                <div className="absolute -left-[11px] top-0.5 w-5 h-5 bg-slate-800 rounded-full border-4 border-slate-900"></div>
                <h4 className="text-slate-500 font-bold">Delivered</h4>
                <p className="text-slate-600 text-sm">Pending</p>
             </div>
           </div>
        </motion.div>
      )}
    </div>
  );
}
