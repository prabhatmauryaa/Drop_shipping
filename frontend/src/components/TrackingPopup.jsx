import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Clock, X } from 'lucide-react';

export default function TrackingPopup({ show, order, onClose }) {
 if (!show || !order) return null;

 const statuses = ["Pending", "Processing", "Forwarded", "Dispatched", "Out for Delivery", "Delivered"];
 
 const getStatusIndex = (status) => {
 if (status === "Cancelled") return -1;
 return statuses.indexOf(status);
 };
 
 const currentIndex = getStatusIndex(order.status);

 return (
 <AnimatePresence>
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
 <motion.div 
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
 >
 <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
 <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-3">Track Package</h2>
 
 <div className="space-y-6 relative">
   <div className="absolute top-2 bottom-2 left-5 w-0.5 bg-slate-800" />

   {statuses.map((s, idx) => {
     const isCompleted = idx <= currentIndex;
     const isCurrent = idx === currentIndex;
     return (
       <div key={s} className="flex gap-4 relative z-10">
         <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 shrink-0 shadow transition-colors ${isCompleted ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-500"}`}>
           {isCompleted ? <CheckCircle className="w-5 h-5"/> : <Clock className="w-4 h-4"/>}
         </div>

         <div className={`flex-1 p-3 rounded-xl border transition-colors ${isCurrent ? 'bg-blue-500/10 border-blue-500/30' : 'bg-slate-800/40 border-slate-800/50'}`}>
           <div className={`font-bold text-sm mb-0.5 ${isCurrent ? 'text-blue-400' : isCompleted ? 'text-white' : 'text-slate-500'}`}>{s}</div>
           <div className={`text-xs ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
             {s === "Pending" && "Order accepted by Vastra culture."}
             {s === "Processing" && "Seller is preparing your item."}
             {s === "Forwarded" && "Automatically forwarded to trusted supplier."}
             {s === "Dispatched" && "Item picked up by courier partner."}
             {s === "Out for Delivery" && "Package is on its way to your doorstep!"}
             {s === "Delivered" && "Successfully delivered. Enjoy!"}
           </div>
         </div>
       </div>
     );
   })}
 </div>
 </motion.div>
 </div>
 </AnimatePresence>
 );
}
