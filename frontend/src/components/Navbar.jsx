"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, User, Package, Zap, Search, ChevronRight, Loader, Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const { getTotalItems } = useCart();
    const { wishlist } = useWishlist();
    const cartCount = mounted ? getTotalItems() : 0;
    const wishlistCount = mounted ? wishlist.length : 0;
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [token, setToken] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const searchInputRef = useRef(null);
    const menuRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        setToken(localStorage.getItem("dropsync_token"));

        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isMenuOpen]);

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!searchQuery.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products`);
                const products = await response.json();
                
                const filtered = products.filter((product) =>
                    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.category.toLowerCase().includes(searchQuery.toLowerCase())
                );

                setSearchResults(filtered.slice(0, 6));
                setIsSearching(false);
            } catch (error) {
                console.error("Search error:", error);
                setSearchResults([]);
                setIsSearching(false);
            }
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery("");
            setSearchResults([]);
            setIsMenuOpen(false);
        }
    };

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Suppliers", path: "/suppliers" },
    ];

    const renderAuthLinks = () => {
        if (token) {
            let dashLink = "/dashboard";
            if (typeof window !== "undefined") {
                const ustr = localStorage.getItem("dropsync_user");
                if (ustr) {
                    const pUser = JSON.parse(ustr);
                    if (pUser.role === 'admin' || pUser.role === 'supplier') {
                        dashLink = `/${pUser.role}/dashboard`;
                    }
                }
            }

            return (
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <Link href={dashLink} onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-blue-400 transition-colors text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4" /> Dashboard
                    </Link>
                    <button 
                        onClick={() => {
                            localStorage.removeItem("dropsync_token");
                            setToken(null);
                            window.location.href = "/";
                        }}
                        className="px-4 py-2 rounded-xl text-sm font-bold border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-left md:text-center"
                    >
                        Logout
                    </button>
                </div>
            );
        }

        return (
            <div className="flex flex-col md:flex-row md:items-center gap-4">
                <Link href="/login" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white transition-colors text-sm font-medium">
                    Login
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2">
                    <span>Sign Up</span>
                </Link>
            </div>
        );
    };

    return (
        <header 
            className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? "bg-slate-900/90 backdrop-blur-md border-b border-white/10 shadow-xl" : "bg-slate-950 py-4"
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                
                <div className="flex items-center gap-4">
                    {/* Left Menu Button (Categories/Search) - Hidden on mobile when logged in */}
                    <div className={`relative ${token ? 'hidden md:block' : 'block'}`} ref={menuRef}>
                        <button 
                            className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute top-full left-0 mt-2 w-72 max-h-96 bg-slate-800/95 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col"
                                >
                                    <div className="flex flex-col p-4 gap-2 overflow-y-auto">
                                        <form onSubmit={handleSearch} className="mb-2">
                                            <div className="relative">
                                                <input
                                                    ref={searchInputRef}
                                                    type="text"
                                                    placeholder="Search products..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                                                />
                                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                                    {isSearching ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </form>

                                        {!searchQuery.trim() && (
                                            <>
                                                <div className="h-px bg-slate-700 my-1" />
                                                {["Men", "Women", "Accessories", "New Arrivals"].map((cat) => (
                                                    <Link
                                                        key={cat}
                                                        href={`/products?category=${cat}`}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-colors flex items-center justify-between group"
                                                    >
                                                        <span className="font-medium">{cat}</span>
                                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </Link>
                                                ))}
                                                <div className="h-px bg-slate-700 my-1" />
                                                <Link href="/products" onClick={() => setIsMenuOpen(false)} className="px-4 py-3 rounded-lg text-blue-400 hover:bg-blue-500/10 transition-colors flex items-center gap-2 font-medium">
                                                    <Package className="w-4 h-4" /> View All Products
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight hidden sm:inline">
                            vastra<span className="text-blue-400"> culture</span>
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-6 bg-slate-800/50 backdrop-blur-md rounded-full px-6 py-2 border border-white/5">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.path} 
                                href={link.path}
                                className={`text-sm font-medium transition-all relative ${pathname === link.path ? "text-white" : "text-slate-400 hover:text-white"}`}
                            >
                                {link.name}
                                {pathname === link.path && (
                                    <motion.div layoutId="navbar-indicator" className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
                                )}
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/wishlist" className="relative w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-pink-400 transition-all">
                        <Heart className="w-5 h-5" />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-pink-600 text-white text-xs font-black rounded-full flex items-center justify-center shadow-lg shadow-pink-500/40">
                                {wishlistCount > 9 ? "9+" : wishlistCount}
                            </span>
                        )}
                    </Link>

                    <Link href="/cart" className="relative w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-all">
                        <ShoppingCart className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-white text-xs font-black rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40">
                                {cartCount > 9 ? "9+" : cartCount}
                            </span>
                        )}
                    </Link>
                    {renderAuthLinks()}
                </div>

                {/* Mobile Menu Button (Hamburger) */}
                <button 
                    className="md:hidden text-slate-300 hover:text-white p-2"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setIsMenuOpen(false);
                    }}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 bg-slate-900 border-b border-white/10 shadow-2xl md:hidden overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {navLinks.map((link) => (
                                <Link key={link.path} href={link.path} onClick={() => setIsOpen(false)} className={`text-base font-medium p-3 rounded-xl ${pathname === link.path ? "bg-blue-600/10 text-blue-400" : "text-slate-300 hover:bg-slate-800"}`}>
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-px bg-white/10 my-2" />
                            <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">Categories</p>
                                {["Men", "Women", "Accessories"].map(cat => (
                                    <Link key={cat} href={`/products?category=${cat.toLowerCase()}`} onClick={() => setIsOpen(false)} className="block text-base font-medium p-3 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors">
                                        {cat}
                                    </Link>
                                ))}
                            </div>
                            <div className="h-px bg-white/10 my-2" />
                            <Link href="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-3 rounded-xl text-slate-300 hover:bg-slate-800">
                                <span className="flex items-center gap-2 font-medium"><Heart className="w-4 h-4" /> Wishlist</span>
                                {wishlistCount > 0 && <span className="w-6 h-6 bg-pink-600 text-white text-xs font-black rounded-full flex items-center justify-center">{wishlistCount}</span>}
                            </Link>
                            <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-3 rounded-xl text-slate-300 hover:bg-slate-800">
                                <span className="flex items-center gap-2 font-medium"><ShoppingCart className="w-4 h-4" /> Cart</span>
                                {cartCount > 0 && <span className="w-6 h-6 bg-blue-600 text-white text-xs font-black rounded-full flex items-center justify-center">{cartCount}</span>}
                            </Link>
                            <div className="h-px bg-white/10 my-2" />
                            {renderAuthLinks()}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
