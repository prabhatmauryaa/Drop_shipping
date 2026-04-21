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
           
           <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
              {statuses.map((s, idx) => {
                  const isCompleted = idx <= currentIndex;
                  const isCurrent = idx === currentIndex;
                  return (
                      <div key={s} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-900 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow transition-colors z-10 ${isCompleted ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-500"}`}>
                             {isCompleted ? <CheckCircle className="w-5 h-5"/> : <Clock className="w-4 h-4"/>}
                          </div>
                          
                          <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border transition-colors ${isCurrent ? 'bg-blue-500/10 border-blue-500/30' : 'bg-slate-800/40 border-slate-800/50'}`}>
                             <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className={`font-bold text-sm ${isCurrent ? 'text-blue-400' : isCompleted ? 'text-white' : 'text-slate-500'}`}>{s}</div>
                             </div>
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
