import React from "react";
import { ShieldCheck, Zap, Globe, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full relative pt-24 px-6 mb-20">
      <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About <span className="text-gradient">Vastra culture</span></h1>
        <p className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
          We are the ultimate dropshipping ecosystem for customers, sellers, and suppliers. Our mission is to democratize ecommerce by removing the barriers of inventory and logistics.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
        <div className="glass rounded-3xl p-10 border border-slate-700 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500 rounded-full blur-[60px] opacity-20"></div>
          <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            We envision a world where anyone can start a business without risk. By directly connecting the world's best suppliers with ambitious sellers, we eliminate dead stock, reduce carbon footprint through local delivery hubs, and provide customers with the highest quality products.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors">
            <Globe className="w-10 h-10 text-blue-400 mb-4" />
            <h3 className="font-bold text-white mb-2">Global Reach</h3>
            <p className="text-sm text-slate-400">Ship to over 150 countries with localized routing.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-purple-500/50 transition-colors mt-6">
            <Zap className="w-10 h-10 text-purple-400 mb-4" />
            <h3 className="font-bold text-white mb-2">Instant Sync</h3>
            <p className="text-sm text-slate-400">Real-time inventory subtraction ensures no out-of-stock orders.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-green-500/50 transition-colors -mt-6">
            <ShieldCheck className="w-10 h-10 text-green-400 mb-4" />
            <h3 className="font-bold text-white mb-2">Buyer Protection</h3>
            <p className="text-sm text-slate-400">Integrated Return Management and Quality Control.</p>
          </div>
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 hover:border-pink-500/50 transition-colors">
            <Users className="w-10 h-10 text-pink-400 mb-4" />
            <h3 className="font-bold text-white mb-2">Thriving Network</h3>
            <p className="text-sm text-slate-400">Over 50,000 sellers and suppliers working in perfect harmony.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
