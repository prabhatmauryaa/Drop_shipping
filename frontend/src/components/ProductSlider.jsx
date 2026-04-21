'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import toast from 'react-hot-toast';

const ProductSlider = ({ 
  products, 
  title, 
  titleHighlight, 
  subtitle, 
  shopLink, 
  shopLinkText,
  showBadge = false,
  badgeText = 'New Arrival',
  showCartButton = true // show cart in info area vs overlay
}) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const sliderRef = useRef(null);

  // Calculate items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(4);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const totalSlides = Math.ceil(products.length / itemsPerView);

  const slideNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const slidePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(slideNext, 5000);
    return () => clearInterval(interval);
  }, [totalSlides, slideNext]);

  const handleAddToCart = (item) => {
    addToCart({ ...item, images: [item.img] });
    toast.success(`${item.name} added to cart!`);
  };

  const handleAddToWishlist = (item) => {
    if (isInWishlist(item.id)) {
      toast('Already in wishlist', { icon: '❤️' });
      return;
    }
    addToWishlist({ ...item, images: [item.img] });
    toast.success(`${item.name} added to wishlist!`);
  };

  // Get visible products for current slide
  const getVisibleProducts = () => {
    const start = currentIndex * itemsPerView;
    return products.slice(start, start + itemsPerView);
  };

  return (
    <section className="bg-white py-10 px-6 font-sans text-black">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-8 border-b border-black/5 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tighter uppercase leading-none">
            {title} <span className="text-gray-600">{titleHighlight}</span>
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-800 mt-2">
            {subtitle}
          </p>
        </div>
        <a 
          href={shopLink} 
          className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all hidden sm:block"
        >
          {shopLinkText}
        </a>
      </div>

      {/* Product Slider Wrapper */}
      <div className="max-w-7xl mx-auto relative group/slider">
        
        {/* Slider Controls */}
        {totalSlides > 1 && (
          <>
            <button 
              onClick={slidePrev}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-black p-3 opacity-0 group-hover/slider:opacity-100 transition-all shadow-xl hover:bg-black hover:text-white"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={slideNext}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-black p-3 opacity-0 group-hover/slider:opacity-100 transition-all shadow-xl hover:bg-black hover:text-white"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Slider Content with Animation */}
        <div ref={sliderRef} className="overflow-hidden">
          <div 
            className="grid gap-6 transition-all duration-500 ease-in-out"
            style={{
              gridTemplateColumns: `repeat(${itemsPerView}, minmax(0, 1fr))`
            }}
          >
            {getVisibleProducts().map((item) => (
              <div key={item.id} className="relative group/card">
                
                {/* Image Container */}
                <div 
                  className="aspect-[3/4] bg-gray-50 overflow-hidden relative border border-black/5 cursor-pointer"
                  onClick={() => router.push(`/product/${item.id}`)}
                >
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover/card:scale-105" 
                  />
                  
                  {/* Badge */}
                  {showBadge && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-black text-white text-[8px] font-bold px-3 py-1.5 uppercase tracking-widest">
                        {badgeText}
                      </span>
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAddToWishlist(item); }}
                    className={`absolute top-4 right-4 transition-colors ${isInWishlist(item.id) ? 'text-red-500' : 'text-black hover:text-red-500'}`}
                  >
                    <Heart size={18} strokeWidth={1.5} fill={isInWishlist(item.id) ? 'currentColor' : 'none'} />
                  </button>

                  {/* Add to Cart Overlay (slides up on hover) */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(item); }}
                    className="absolute bottom-0 left-0 right-0 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 bg-white/90 py-2 text-center text-[10px] font-bold uppercase tracking-tighter text-gray-800 cursor-pointer hover:bg-black hover:text-white"
                  >
                    Add to Cart
                  </button>
                </div>

                {/* Info Container */}
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="cursor-pointer" onClick={() => router.push(`/product/${item.id}`)}>
                      <h3 className="text-[10px] font-bold uppercase tracking-tight truncate max-w-[150px]">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold">₹{item.price.toLocaleString()}</p>
                    </div>
                    
                    {/* Quick Action Buttons */}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => router.push(`/product/${item.id}`)}
                        className="p-2.5 bg-gray-50 text-gray-400 hover:text-black border border-transparent hover:border-black transition-all"
                      >
                        <Eye size={16} />
                      </button>
                      {showBadge && (
                        <button 
                          onClick={() => handleAddToCart(item)}
                          className="p-2.5 bg-black text-white hover:bg-gray-800 transition-all"
                        >
                          <ShoppingBag size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-[2px] transition-all duration-500 ease-in-out cursor-pointer ${
                currentIndex === index ? 'w-10 bg-black' : 'w-6 bg-gray-300 hover:bg-black'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Mobile shop link */}
      <div className="sm:hidden text-center mt-8">
        <a 
          href={shopLink} 
          className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all"
        >
          {shopLinkText}
        </a>
      </div>
    </section>
  );
};

export default ProductSlider;
