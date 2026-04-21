'use client';

import React from 'react';
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/footer";

export default function LayoutWrapper({ children }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center relative w-full overflow-hidden">
          {children}
        </main>
        <Footer />
      </WishlistProvider>
    </CartProvider>
  );
}
