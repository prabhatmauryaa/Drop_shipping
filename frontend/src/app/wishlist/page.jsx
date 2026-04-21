"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, ArrowLeft, Box, Star, PackageOpen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "@/context/CartContext";

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (product) => {
    addToCart({
      _id: product._id || product.id,
      id: product.id || product._id,
      title: product.title || product.name,
      price: product.price,
      imageUrl: product.imageUrl || product.image,
      stock: product.stock || 999,
      category: product.category,
      quantity: 1,
      qty: 1,
    });
    toast.success(`${product.title || product.name} added to cart!`);
  };

  const handleRemoveFromWishlist = (itemId) => {
    removeFromWishlist(itemId);
    toast.success("Removed from wishlist");
  };

  if (!mounted) return null;

  return (
    <div className="w-full relative z-10 flex flex-col min-h-screen pt-24 px-4 pb-20 max-w-7xl mx-auto">
      <Toaster position="top-center" />

      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="w-full flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          <Heart className="w-10 h-10 text-pink-500 fill-pink-500" /> My Wishlist
        </h1>
        {wishlist.length > 0 && (
          <button
            onClick={() => {
              clearWishlist();
              toast.success("Wishlist cleared");
            }}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="glass p-12 rounded-2xl text-center border border-slate-700/50">
          <PackageOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-6">Your wishlist is empty</p>
          <button
            onClick={() => router.push("/products")}
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {wishlist.map((product, idx) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-500 hover:shadow-2xl hover:shadow-pink-500/10 transition-all flex flex-col group"
              >
                <div className="h-48 w-full bg-slate-800 relative overflow-hidden flex items-center justify-center">
                  {product.imageUrl || product.image ? (
                    <img
                      src={product.imageUrl || product.image}
                      alt={product.title || product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <Box className="w-16 h-16 text-slate-700" />
                  )}

                  <div className="absolute top-3 right-3 bg-slate-900/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white border border-slate-700/50 flex items-center gap-1 z-20">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> 4.8
                  </div>

                  <button
                    onClick={() => handleRemoveFromWishlist(product._id || product.id)}
                    className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 flex items-center justify-center text-red-400 hover:text-red-300 transition-all z-20"
                  >
                    <Heart className="w-5 h-5 fill-red-400" />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-1 bg-slate-900/40">
                  <span className="text-pink-400 text-xs font-bold uppercase tracking-wider mb-2 block">
                    {product.category}
                  </span>
                  <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2">
                    {product.title || product.name}
                  </h3>

                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div>
                      <span className="text-slate-500 text-xs line-through block">
                        {" "}
                        ₹{((product.price || 0) * 1.2).toFixed(2)}
                      </span>
                      <span className="text-green-400 font-black text-xl">
                        ₹{(product.price || 0).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                      title="Add to Cart"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-12 glass p-8 rounded-2xl border border-slate-700/50">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-500" /> Wishlist Tips
        </h2>
        <ul className="space-y-2 text-slate-300 text-sm">
          <li>• Save your favorite products for later</li>
          <li>• Add items to cart when you're ready to purchase</li>
          <li>• Remove items by clicking the heart icon</li>
          <li>• Your wishlist is saved on this device</li>
        </ul>
      </div>
    </div>
  );
}
