"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Box, ShoppingCart, Star, PackageOpen, Heart } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(10000); // Active slider value
  const [categories, setCategories] = useState(["All", "Men", "Women", "Accessories"]);
  const [maxPriceDefault, setMaxPriceDefault] = useState(10000); // Dynamic max slider range limit

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        
        // Filter out products with "Fashion" and "Beauty & Health" categories
        const filteredByCategory = res.data.filter(p => 
          p.category !== "Fashion" && p.category !== "Beauty & Health"
        );
        
        setProducts(filteredByCategory);
        setFilteredProducts(filteredByCategory);

        // Keep default categories and add any additional ones from DB (excluding Fashion and Beauty & Health)
        const defaultCategories = ["All", "Men", "Women", "Accessories"];
        const uniqueCats = [...defaultCategories, ...new Set(filteredByCategory.map(p => p.category).filter(Boolean).filter(cat => !defaultCategories.includes(cat) && cat !== "Fashion" && cat !== "Beauty & Health"))];
        setCategories(uniqueCats);

        // Dynamically adjust price slider to comfortably fit the highest priced item
        if (filteredByCategory.length > 0) {
          const maxItemPrice = Math.max(...filteredByCategory.map(p => p.price));
          const calculatedMax = Math.ceil(maxItemPrice * 1.1); // Add 10% buffer
          setMaxPriceDefault(calculatedMax);
          setPriceRange(calculatedMax);
        }
      } catch (err) {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Read query parameters from URL
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    if (categoryParam) {
      // Capitalize the category parameter to match the state
      const capitalizedCategory = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase();
      setSelectedCategory(capitalizedCategory);
    }

    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  useEffect(() => {
    // Apply Filters
    let result = products;

    if (searchTerm) {
      result = result.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedCategory !== "All") {
      result = result.filter(p => 
        p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    result = result.filter(p => p.price <= priceRange);

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, priceRange, products]);

  return (
    <div className="w-full relative z-10 flex flex-col min-h-screen pt-24 px-4 pb-20 max-w-7xl mx-auto">
      <Toaster position="top-center" />

      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <h1 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
        <Box className="w-10 h-10 text-blue-500" /> All Products
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Left Side: Advanced Filters */}
        <div className="w-full lg:w-1/4 space-y-6">
          <div className="glass p-6 rounded-2xl border border-slate-700/50 sticky top-28 shadow-xl">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
              <Filter className="w-5 h-5 text-blue-400" /> Filters
            </h2>

            {/* Search Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Search Products</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500"><Search className="w-4 h-4" /></div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="e.g. Headphones"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className={`text-sm tracking-wide capitalize ${selectedCategory === cat ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-300'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2 flex justify-between">
                <span>Max Price</span>
                <span className="text-blue-400 font-bold">₹{priceRange}</span>
              </label>
              <input
                type="range"
                min="0"
                max={maxPriceDefault}
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setPriceRange(maxPriceDefault); }}
              className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all border border-slate-700"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Right Side: Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center p-20"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent flex rounded-full animate-spin"></div></div>
          ) : filteredProducts.length === 0 ? (
            <div className="glass p-10 rounded-2xl text-center border border-slate-700/50">
              <PackageOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No products found matching your filters.</p>
              <button onClick={() => { setSearchTerm(""); setSelectedCategory("All"); setPriceRange(maxPriceDefault); }} className="mt-4 text-blue-400 hover:text-blue-300">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => router.push(`/product/${product._id}`)}
                  className="glass rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex flex-col group cursor-pointer"
                >
                  <div className="h-48 w-full bg-slate-800 relative overflow-hidden flex items-center justify-center">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 group-hover:scale-110 transition-transform duration-700"></div>
                    )}
                    {!product.imageUrl && <ShoppingCart className="w-16 h-16 text-slate-700 z-10" />}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
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
                      className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-slate-900/60 hover:bg-pink-500/20 backdrop-blur-md border border-slate-700/50 hover:border-pink-500/40 flex items-center justify-center z-20 transition-all"
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-pink-500 text-pink-500' : 'text-slate-300 hover:text-pink-400'}`} />
                    </button>

                    <div className="absolute top-3 right-3 bg-slate-900/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white border border-slate-700/50 flex items-center gap-1 z-20">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> 4.8
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 bg-slate-900/40">
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2 block">{product.category}</span>
                    <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2">{product.title}</h3>

                    <div className="flex items-center justify-between mt-auto pt-4">
                      <div>
                        <span className="text-slate-500 text-xs line-through block"> ₹{(product.price * 1.2).toFixed(2)}</span>
                        <span className="text-green-400 font-black text-xl">₹{product.price.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); router.push(`/checkout/${product._id}?qty=1`); }}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                        title="Buy Now"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
