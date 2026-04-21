'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonial = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      id: 1,
      quote: "Better quality and aesthetic than the big fast-fashion brands. Truly premium fabric.",
      author: "Tamchi Nyakum",
      title: "Fashion Enthusiast"
    },
    {
      id: 2,
      quote: "The delivery update system is a game changer. Finally, a brand that respects my time.",
      author: "Rahul Verma",
      title: "Verified Buyer"
    },
    {
      id: 3,
      quote: "Minimalist drip that actually hits different. Vastra Culture is the new standard.",
      author: "Sneha Kapoor",
      title: "Stylist"
    }
  ];

  const goToSlide = useCallback((index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide((activeSlide + 1) % testimonials.length);
  }, [activeSlide, testimonials.length, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((activeSlide - 1 + testimonials.length) % testimonials.length);
  }, [activeSlide, testimonials.length, goToSlide]);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="bg-white py-20 px-6 font-sans border-y border-black/5">
      <div className="max-w-4xl mx-auto text-center relative">
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 text-gray-400 hover:text-black transition-colors hidden md:block"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={24} strokeWidth={1} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 text-gray-400 hover:text-black transition-colors hidden md:block"
          aria-label="Next testimonial"
        >
          <ChevronRight size={24} strokeWidth={1} />
        </button>

        {/* Quote Icon */}
        <div className="flex justify-center mb-8">
          <Quote size={32} strokeWidth={1} className="text-gray-600" />
        </div>

        {/* Testimonial Content with Fade Transition */}
        <div className="min-h-[160px] flex flex-col justify-center overflow-hidden">
          <h2 
            className={`text-xl md:text-3xl font-medium tracking-tight text-black leading-relaxed mb-6 transition-all duration-500 ${
              isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            &ldquo;{testimonials[activeSlide].quote}&rdquo;
          </h2>
          
          <div 
            className={`flex flex-col items-center transition-all duration-500 delay-100 ${
              isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}
          >
            <span className="w-8 h-[1px] bg-black mb-4"></span>
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-black">
              {testimonials[activeSlide].author}
            </p>
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-gray-700 mt-1">
              {testimonials[activeSlide].title}
            </p>
          </div>
        </div>

        {/* Luxury Dash Indicators */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-[2px] transition-all duration-500 ease-in-out ${
                activeSlide === index ? "w-12 bg-black" : "w-6 bg-gray-400 hover:bg-black"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonial;