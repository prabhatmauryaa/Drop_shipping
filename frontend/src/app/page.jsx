'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Collab from '@/components/collab';
import Testimonial from '@/components/Testimonial';
import NewArrivals from '@/components/NewArrivals';
import MensSection from '@/components/MensSection';
import WomensSection from '@/components/WomensSection';
import AccessoriesSection from '@/components/AccessoriesSection';
import { ChevronDown } from 'lucide-react';

const heroSlides = [
  {
    img: 'hero_section_car.png',
    heading: 'Luxury Hits Different',
    subtext: 'Elevate your wardrobe',
  },
  {
    img: 'hero_section_gemini.png',
    heading: 'Redefine Your Style',
    subtext: 'New season, new statement',
  },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % heroSlides.length);
  }, [currentSlide, goToSlide]);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div>
      {/* ===== HERO SECTION WITH IMAGE SLIDER ===== */}
      <section className="relative w-full h-[60vh] md:h-screen overflow-hidden flex items-center justify-center">
        
        {/* Sliding Images */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              currentSlide === index 
                ? 'opacity-100 scale-100' 
                : 'opacity-0 scale-105'
            }`}
          >
            <img 
              src={slide.img} 
              alt={slide.heading} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Centered Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          
          {/* Subtext */}
          <p 
            className={`text-[10px] md:text-xs font-medium uppercase tracking-[0.4em] text-white/70 mb-4 transition-all duration-600 delay-200 ${
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            {heroSlides[currentSlide].subtext}
          </p>

          {/* Heading */}
          <h1 
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold uppercase tracking-[0.15em] -mr-[0.15em] text-white mb-6 md:mb-8 drop-shadow-2xl transition-all duration-6 00 ${
              isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
            }`}
          >
            {heroSlides[currentSlide].heading}
          </h1>

          {/* Decorative Line */}
          <div className="w-16 h-[1px] bg-white/50 mb-8"></div>

          {/* CTA Button */}
          <a href="/products">
            <button className="flex items-center justify-center px-8 py-3 md:px-10 md:py-3.5 text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] text-black transition-all duration-300 bg-white hover:bg-gray-100 shadow-2xl hover:scale-105 transform">
              Explore Now
            </button>
          </a>
        </div>

        {/* Hero Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-[2px] transition-all duration-500 ${
                currentSlide === index ? 'w-10 bg-white' : 'w-5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to hero slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden md:block">
          <ChevronDown size={20} className="text-white/50" strokeWidth={1} />
        </div>
      </section>

      {/* ===== NEW ARRIVALS ===== */}
      <NewArrivals />
      
      {/* ===== MEN'S SECTION ===== */}
      <MensSection />

      {/* ===== WOMEN'S SECTION ===== */}
      <WomensSection />

      {/* ===== COLLABORATION BRANDS ===== */}
      <Collab />

      {/* ===== ACCESSORIES ===== */}
      <AccessoriesSection />

      {/* ===== TESTIMONIALS ===== */}
      <Testimonial />
    </div>
  );
};

export default Hero;