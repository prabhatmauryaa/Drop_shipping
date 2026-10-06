"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, Box, ArrowLeft, ShieldCheck, Share2, CreditCard } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import api, { getImageUrl, getErrorMessage } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const ustr = typeof window !== "undefined" ? localStorage.getItem("dropsync_user") : null;
    if (ustr) {
      try {
        setUserRole(JSON.parse(ustr).role);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/single/${id}`);
        setProduct(res.data);
        if (res.data?.images && res.data.images.length > 0) {
          setActiveImage(res.data.images[0]);
        } else if (res.data?.imageUrl) {
          setActiveImage(res.data.imageUrl);
        }

        const recRes = await api.get("/products");
        const filtered = (recRes.data || []).filter((p) => p._id !== id).slice(0, 4);
        setRecommendations(filtered);
      } catch (err) {
        toast.error(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    const finalImg = getImageUrl(activeImage || product.imageUrl || (product.images && product.images[0]));
    addToCart({
      _id: product._id,
      id: product._id,
      name: product.title,
      title: product.title,
      price: product.price,
      imageUrl: finalImg,
      img: finalImg,
      images: [finalImg],
      qty: qty,
      size: selectedSize || null,
    });
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    const query = new URLSearchParams({
      qty: qty.toString(),
      ...(selectedSize && { size: selectedSize }),
    }).toString();
    router.push(`/checkout/${product._id}?${query}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent flex rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
        <p className="text-slate-400 mb-6">The item you are searching for might be removed or discontinued.</p>
        <button
          onClick={() => router.push("/products")}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const primaryImg = getImageUrl(activeImage || product.imageUrl || (product.images && product.images[0]));

  return (
    <div className="w-full relative z-10 flex flex-col min-h-screen pt-24 px-4 pb-20 max-w-7xl mx-auto">
      <Toaster position="top-center" />

      <div className="mb-6">
        <button
          onClick={() => router.push("/products")}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Store
        </button>
      </div>

      <div className="w-full glass rounded-3xl border border-slate-700/50 p-6 md:p-12 shadow-2xl overflow-hidden relative">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Frame */}
          <div className="w-full lg:w-1/2">
            <div className="w-full aspect-square rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/80 relative flex items-center justify-center group">
              {primaryImg ? (
                <motion.img
                  key={primaryImg}
                  initial={{ scale: 1.05, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  src={primaryImg}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => { e.target.src = "/placeholder-product.svg"; }}
                />
              ) : (
                <ShoppingCart className="w-24 h-24 text-slate-600" />
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => {
                    if (isInWishlist(product._id)) {
                      removeFromWishlist(product._id);
                      toast.success("Removed from wishlist");
                    } else {
                      addToWishlist({
                        _id: product._id,
                        id: product._id,
                        title: product.title,
                        price: product.price,
                        imageUrl: primaryImg,
                        category: product.category,
                      });
                      toast.success("Added to wishlist");
                    }
                  }}
                  className={`w-10 h-10 rounded-xl backdrop-blur-md flex items-center justify-center transition-all border border-slate-700/50 ${
                    isInWishlist(product._id)
                      ? "bg-pink-500/20 text-pink-400 border-pink-500/40"
                      : "bg-slate-900/60 text-slate-300 hover:text-pink-400 hover:bg-slate-800"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? "fill-pink-400" : ""}`} />
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: product.title, url: window.location.href }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied!");
                    }
                  }}
                  className="w-10 h-10 rounded-xl bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/50"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
                {product.images.slice(0, 5).map((img, idx) => {
                  const thumb = getImageUrl(img);
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        (activeImage || product.imageUrl) === img
                          ? "border-blue-500 scale-95"
                          : "border-slate-700 hover:border-slate-500"
                      }`}
                    >
                      <img
                        src={thumb}
                        alt={`Product thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain bg-slate-900"
                        onError={(e) => { e.target.src = "/placeholder-product.svg"; }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="inline-flex items-center gap-1.5 text-blue-400 text-xs font-bold tracking-wider uppercase bg-blue-500/10 px-3 py-1 rounded-full w-fit mb-4 border border-blue-500/20">
              <Box className="w-3.5 h-3.5" /> {product.category}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">{product.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center text-yellow-500 gap-1 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                <Star className="w-4 h-4 fill-yellow-500" /> <span className="text-sm font-bold">4.8 Rating</span>
              </div>
              <span className="text-slate-500 text-sm">|</span>
              <p className="text-green-400 text-sm font-bold">
                {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
              </p>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed mb-8">{product.description}</p>

            <div className="mt-auto">
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-5xl font-black text-white">₹{(product.price || 0).toFixed(2)}</span>
                <span className="text-xl text-slate-500 line-through">₹{((product.price || 0) * 1.3).toFixed(2)}</span>
              </div>

              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-300 mb-2">Select Size</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl border font-bold text-sm transition-all ${
                          selectedSize === size
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20"
                            : "bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {userRole === "admin" || userRole === "supplier" ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center mb-8">
                  <p className="text-amber-400 text-sm font-bold flex items-center justify-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Admins and Suppliers are not allowed to place orders.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl h-14">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-white font-bold text-xl transition-colors"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-white font-bold">{qty}</span>
                      <button
                        onClick={() => setQty(Math.min(product.stock || 1, qty + 1))}
                        className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-white font-bold text-xl transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 h-14 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" /> Add to Cart
                    </button>
                  </div>

                  <button
                    onClick={handleBuyNow}
                    className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg shadow-blue-500/20"
                  >
                    <CreditCard className="w-6 h-6" /> Buy it Now
                  </button>
                </>
              )}

              <div className="mt-6 flex items-center justify-center gap-6 border-t border-slate-800 pt-6">
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                  <ShieldCheck className="w-5 h-5 text-green-500" /> Secure Checkout
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                  <Box className="w-5 h-5 text-purple-500" /> 7-Day Returns
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="w-full mt-24">
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
            <Star className="w-6 h-6 text-yellow-400" /> Recommended For You
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((rec) => {
              const recImg = getImageUrl(rec.imageUrl || (rec.images && rec.images[0]));
              return (
                <div
                  key={rec._id}
                  onClick={() => router.push(`/product/${rec._id}`)}
                  className="glass rounded-xl overflow-hidden border border-slate-700/50 hover:border-slate-500 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer group transition-all flex flex-col"
                >
                  <div className="h-40 w-full bg-slate-800 relative overflow-hidden flex items-center justify-center">
                    {recImg ? (
                      <img
                        src={recImg}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                        alt={rec.title}
                        onError={(e) => { e.target.src = "/placeholder-product.svg"; }}
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Box className="w-10 h-10 text-slate-600" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1 bg-slate-900/60">
                    <p className="text-white font-bold text-sm line-clamp-1 mb-1">{rec.title}</p>
                    <p className="text-green-400 font-black mt-auto">₹{(rec.price || 0).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
