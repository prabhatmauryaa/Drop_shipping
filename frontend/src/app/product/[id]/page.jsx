"use client";

import React, { useEffect, useState, use } from "react"; // Added "use" from react
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, ShieldCheck, Star, Box, Share2, CreditCard, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Script from "next/script";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductDetailPage({ params }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  // Unwrap params using React.use() to fix strict mode warning in App Router
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        const found = res.data.find(p => p._id === id);
        if(found) {
            setProduct(found);
            const recs = res.data.filter(p => p.category === found.category && p._id !== found._id).slice(0, 4);
            setRecommendations(recs);
        }
      } catch (err) {
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    router.push(`/checkout/${id}?qty=${qty}`);
  };

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      id: product._id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl || null,
      stock: product.stock,
      category: product.category,
      supplier: product.supplier?._id || product.supplier || "000000000000000000000000",
      quantity: qty,
      qty: qty,
    });
    toast.success(`${product.title} added to cart!`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent flex rounded-full animate-spin"></div></div>;

  if (!product) return <div className="min-h-screen flex items-center justify-center text-slate-400">Product not found. <button onClick={() => router.push("/")} className="ml-2 text-blue-500">Go back</button></div>;

  return (
    <div className="min-h-screen w-full relative pt-24 px-4 pb-20 max-w-7xl mx-auto flex flex-col items-center">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Toaster position="top-center" />
      
      {/* Background glowing effects */}
      <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      
      <div className="w-full flex items-center mb-8">
        <button onClick={() => router.back()} className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Back to Store
        </button>
      </div>

      <div className="w-full glass rounded-3xl border border-slate-700/50 p-6 md:p-12 shadow-2xl overflow-hidden relative">
         <div className="flex flex-col lg:flex-row gap-12">
           
           {/* Image Frame */}
           <div className="w-full lg:w-1/2">
             <div className="w-full aspect-square rounded-2xl overflow-hidden border border-slate-700 bg-slate-800/80 relative flex items-center justify-center group">
               {product.imageUrl ? (
                 <motion.img 
                   initial={{ scale: 1.1, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   transition={{ duration: 0.5 }}
                   src={product.imageUrl} 
                   alt={product.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
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
                         imageUrl: product.imageUrl,
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
                 <button className="w-10 h-10 rounded-xl bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700/50">
                    <Share2 className="w-4 h-4" />
                 </button>
               </div>
             </div>
           </div>

           {/* Product Context Details */}
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
                 <p className="text-green-400 text-sm font-bold">{product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}</p>
              </div>

              <p className="text-slate-400 text-lg leading-relaxed mb-8">{product.description}</p>
              
              <div className="mt-auto">
                 <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-5xl font-black text-white">₹{product.price.toFixed(2)}</span>
                    <span className="text-xl text-slate-500 line-through">₹{(product.price * 1.3).toFixed(2)}</span>
                 </div>
                 
                 <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl h-14">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-white font-bold text-xl transition-colors">-</button>
                      <span className="w-12 text-center text-white font-bold">{qty}</span>
                      <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-12 h-full flex items-center justify-center text-slate-400 hover:text-white font-bold text-xl transition-colors">+</button>
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

                 <div className="mt-6 flex items-center justify-center gap-6 border-t border-slate-800 pt-6">
                   <div className="flex items-center gap-2 text-slate-400 text-sm font-medium"><ShieldCheck className="w-5 h-5 text-green-500" /> Secure Checkout</div>
                   <div className="flex items-center gap-2 text-slate-400 text-sm font-medium"><Box className="w-5 h-5 text-purple-500" /> 7-Day Returns</div>
                 </div>
              </div>

           </div>
          </div>
       </div>

       {/* Similar Recommendations Array */}
       {recommendations.length > 0 && (
         <div className="w-full mt-24">
           <h2 className="text-2xl font-bold text-white mb-6 border-b border-slate-800 pb-3 flex items-center gap-2">
             <Star className="w-6 h-6 text-yellow-400" /> Recommended For You
           </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {recommendations.map((rec) => (
               <div 
                 key={rec._id} 
                 onClick={() => router.push(`/product/${rec._id}`)} 
                 className="glass rounded-xl overflow-hidden border border-slate-700/50 hover:border-slate-500 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer group transition-all flex flex-col"
               >
                 <div className="h-40 w-full bg-slate-800 relative overflow-hidden">
                   {rec.imageUrl ? (
                     <img src={rec.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={rec.title} />
                   ) : (
                     <div className="h-full w-full flex items-center justify-center"><Box className="w-10 h-10 text-slate-600" /></div>
                   )}
                 </div>
                 <div className="p-4 flex flex-col flex-1 bg-slate-900/60">
                   <p className="text-white font-bold text-sm line-clamp-1 mb-1">{rec.title}</p>
                   <p className="text-green-400 font-black mt-auto">₹{rec.price.toFixed(2)}</p>
                 </div>
               </div>
             ))}
           </div>
         </div>
       )}
    </div>
  );
}
