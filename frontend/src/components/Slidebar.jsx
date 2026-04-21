'use client';
import React, { useState } from 'react';
import { 
  X, 
  Menu, 
  Search, 
  ShoppingBag, 
  User, 
  ChevronRight, 
  Globe 
} from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    "New Arrivals",
    "Tailored Suits",
    "Essential Tees",
    "Footwear",
    "Accessories",
    "Archive"
  ];

  return (
    <div className=" md:hidden font-sans antialiased text-black">
      {/* TRIGGER BUTTON (Top Navigation Bar Simulation) */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-black/5 bg-white">
        <button onClick={() => setIsOpen(true)} className="flex items-center gap-3">
          <Menu size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Menu</span>
        </button>
        <h1 className="text-sm font-bold tracking-[0.4em] uppercase">Vastra Culture</h1>
        <div className="flex gap-4">
          <Search size={18} strokeWidth={1.5} />
          <ShoppingBag size={18} strokeWidth={1.5} />
        </div>
      </div>

      {/* SIDEBAR OVERLAY */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* SIDEBAR PANEL */}
      <aside 
        className={`fixed top-0 left-0 h-full w-full sm:w-[380px] bg-white z-[110] transition-transform duration-500 ease-in-out border-r border-black ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* 1. CLOSE BUTTON */}
          <div className="flex justify-end p-6">
            <button onClick={() => setIsOpen(false)} className="flex items-center gap-2 group">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-black transition-colors">Close</span>
              <X size={20} strokeWidth={1} />
            </button>
          </div>

          {/* 2. SEARCH INPUT (Clean & Simple) */}
          <div className="px-8 mb-10">
            <div className="relative border-b border-black pb-2">
              <input 
                type="text" 
                placeholder="SEARCH COLLECTION..." 
                className="w-full bg-transparent outline-none text-[11px] font-bold tracking-widest uppercase placeholder:text-gray-300"
              />
              <Search size={14} className="absolute right-0 top-0 text-gray-400" />
            </div>
          </div>

          {/* 3. NAVIGATION LINKS */}
          <nav className="flex-1 px-8 space-y-6 overflow-y-auto">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-8">Categories</h4>
            {categories.map((item) => (
              <a 
                key={item} 
                href="#" 
                className="flex items-center justify-between group border-b border-transparent hover:border-black pb-1 transition-all"
              >
                <span className="text-sm font-bold uppercase tracking-tighter">{item}</span>
                <ChevronRight size={14} className="text-gray-300 group-hover:text-black transition-colors" />
              </a>
            ))}
          </nav>

          {/* 4. FOOTER: Account & Logistics */}
          <div className="p-8 border-t border-black bg-gray-50/50">
            <div className="space-y-6">
              <button className="flex items-center gap-4 group">
                <User size={18} strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">My Account</span>
              </button>
              
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
                <div className="flex items-center gap-4">
                  <Globe size={18} strokeWidth={1.5} />
                  <span>Currency: INR (₹)</span>
                </div>
                <button className="underline">Change</button>
              </div>

              <div className="pt-4">
                <p className="text-[9px] text-gray-400 leading-relaxed uppercase tracking-widest font-medium">
                  Premium Logistics Partner: <br />
                  <span className="text-black">Vastra Logistics India</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
};

export default Sidebar;