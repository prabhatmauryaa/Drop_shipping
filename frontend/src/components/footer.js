import React from "react";
import { Shield, Globe, MessageCircle, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-6 mt-auto relative z-10 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-2xl font-bold text-foreground group">
            <Shield className="text-blue-500 w-8 h-8 group-hover:rotate-12 transition-transform" />
            <span className="text-gradient">Vastra culture</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            The ultimate dropshipping ecosystem for customers, administrators, and suppliers. Build, scale, and deliver with zero inventory.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="#" className="hover:text-blue-500 transition-colors"><Globe className="w-5 h-5" /></a>
            <a href="#" className="hover:text-blue-400 transition-colors"><MessageCircle className="w-5 h-5" /></a>
            <a href="#" className="hover:text-pink-500 transition-colors"><Mail className="w-5 h-5" /></a>
            <a href="#" className="hover:text-blue-700 transition-colors"><MapPin className="w-5 h-5" /></a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Platform</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/products" className="hover:text-blue-400 transition-colors">Find Products</Link></li>
            <li><Link href="/suppliers" className="hover:text-blue-400 transition-colors">Our Suppliers</Link></li>
            <li><Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
            <li><Link href="/track-order" className="hover:text-blue-400 transition-colors">Track Your Order</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Support</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/help" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
            <li><Link href="/returns" className="hover:text-blue-400 transition-colors">Return Policy</Link></li>
            <li><Link href="/shipping" className="hover:text-blue-400 transition-colors">Shipping Info</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Stay Updated</h3>
          <p className="text-sm mb-4">Subscribe to our newsletter for the latest products and updates.</p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-slate-800 border border-slate-700 rounded-l-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500 text-white text-sm"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-r-lg font-medium transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
        <p>&copy; {new Date().getFullYear()} Vastra culture Platform. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
