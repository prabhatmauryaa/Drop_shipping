'use client';
import React, { useState, useEffect, useRef } from 'react';

const NavbarWrapper = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Add glassmorphism after 20px
      setIsScrolled(currentY > 20);

      // Hide/show based on scroll direction
      if (currentY > 80) {
        // Scrolling down → hide navbar
        if (currentY > lastScrollY.current) {
          setIsHidden(true);
        }
        // Scrolling up → show navbar
        else {
          setIsHidden(false);
        }
      } else {
        // Always show near top
        setIsHidden(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b px-6 lg:px-12 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md border-gray-100 shadow-sm' 
          : 'bg-white border-gray-100'
      } ${
        isHidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="max-w-360 mx-auto">
        {children}
      </div>
    </header>
  );
};

export default NavbarWrapper;