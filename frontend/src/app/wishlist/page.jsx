"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, ArrowLeft, Star, PackageOpen, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWishlist } from "@/context/WishlistContext";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "@/context/CartContext";
import { getImageUrl } from "@/lib/api";

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (product) => {
    const rawImg = product.imageUrl || product.image;
    const resolvedImg = getImageUrl(rawImg);
    addToCart({
      _id: product._id || product.id,
      id: product.id || product._id,
      title: product.title || product.name,
      price: product.price,
      imageUrl: resolvedImg,
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
    <div className="w-full relative z-10 flex flex-col min-h-screen pt-24 px-4 sm:px-6 pb-20 max-w-7xl mx-auto font-sans bg-slate-50/50">
      <Toaster position="top-center" />

      <div className="w-full flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-slate-600 hover:text-slate-900 flex items-center gap-2 font-semibold text-sm transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            My Saved Items
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved in your wishlist</p>
        </div>
        {wishlist.length > 0 && (
          <button
            onClick={() => {
              clearWishlist();
              toast.success("Wishlist cleared");
            }}
            className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            Clear All
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl text-center border border-slate-200 shadow-xs max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 mx-auto mb-4">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Your wishlist is empty</h3>
          <p className="text-slate-500 text-sm mb-6">Explore the catalog and save products you love.</p>
          <button
            onClick={() => router.push("/products")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            Explore Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {wishlist.map((product, idx) => {
              const productImg = getImageUrl(product.imageUrl || product.image);
              return (
                <motion.div
                  key={product._id || product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-rose-300 hover:shadow-xl shadow-xs transition-all flex flex-col group"
                >
                  <div className="h-52 w-full bg-slate-50 relative overflow-hidden flex items-center justify-center p-3 border-b border-slate-100">
                    <img
                      src={productImg}
                      alt={product.title || product.name}
                      onError={(e) => { e.currentTarget.src = "/placeholder-product.svg"; }}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />

                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 border border-slate-200/80 flex items-center gap-1 z-20 shadow-xs">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> 4.8
                    </div>

                    <button
                      onClick={() => handleRemoveFromWishlist(product._id || product.id)}
                      className="absolute top-3 left-3 w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-all z-20 shadow-xs"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 flex flex-col flex-1 bg-white">
                    <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-1 block">
                      {product.category || "General"}
                    </span>
                    <h3 className="text-slate-900 font-bold text-base leading-snug mb-3 line-clamp-1">
                      {product.title || product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 text-xs line-through block">
                          ₹{((product.price || 0) * 1.25).toFixed(0)}
                        </span>
                        <span className="text-slate-900 font-black text-xl">
                          ₹{(product.price || 0).toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                        title="Add to Cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
