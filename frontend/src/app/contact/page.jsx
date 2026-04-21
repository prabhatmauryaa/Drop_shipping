import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-[80vh] w-full max-w-7xl mx-auto pt-24 px-6 flex flex-col md:flex-row gap-12 items-center mb-20 relative overflow-hidden">
      <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Left Contact Info */}
      <div className="w-full md:w-1/2 space-y-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">Hello <span className="text-gradient">There!</span></h1>
          <p className="text-slate-400 leading-relaxed max-w-md text-lg">
            Whether you want to be a supplier, a seller, or have an issue with your order, drop us a message and our team will get back to you within 24 hours.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">Chat with us</p>
              <p className="text-slate-500 text-sm">support@vastraculture.hq</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">Call us</p>
              <p className="text-slate-500 text-sm">+1 (800) 123-4567</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group">
            <div className="w-14 h-14 rounded-2xl bg-yellow-600/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">Visit us</p>
              <p className="text-slate-500 text-sm">123 Dropshipping Valley, NY 10001</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full md:w-1/2 glass border border-slate-700/50 p-8 rounded-3xl relative">
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500 rounded-full blur-[40px] opacity-40"></div>
        <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
        
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-slate-400 font-medium">First Name</label>
              <input type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors" placeholder="Jane" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-400 font-medium">Last Name</label>
              <input type="text" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors" placeholder="Doe" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-400 font-medium">Email Address</label>
            <input type="email" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors" placeholder="jane@example.com" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-400 font-medium">Message</label>
            <textarea rows="4" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors resize-none" placeholder="How can we help you?"></textarea>
          </div>
          
          <button type="button" className="w-full bg-gradient-primary text-white font-bold px-6 py-4 rounded-xl flex items-center justify-center gap-2 mt-4 hover:shadow-lg hover:shadow-blue-500/20 transition-all">
            Send Message <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
