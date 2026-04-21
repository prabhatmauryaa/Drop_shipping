'use client';
import React from 'react';
import ProductSlider from './ProductSlider';

const NewArrivals = () => {
  const products = [
    { id: 'na-1', name: "black cargo pants", price: 799, img: "https://nolabels.in/cdn/shop/files/32_806d5eaf-a997-4b05-b5bd-28ad4a3312bd.jpg?v=1758525483&width=1080", category: "Men" },
    { id: 'na-2', name: "BROWN VARSITY SHACKET", price: 1199, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600", category: "Men" },
    { id: 'na-3', name: "Biege half sleeve linen shirt for men", price: 899, img: "https://vestirio.com/cdn/shop/files/016_08d7fef7-0e85-4299-8ac1-ef98df1bba22.webp?v=1714383259&width=1080", category: "Men" },
    { id: 'na-4', name: "Oversized fit T-Shirt", price: 1009, img: "https://www.urbanmonkey.com/cdn/shop/files/um-heavyweight-core-choco-moose-um24a-rev-bf2-xs-1896549.jpg?v=1756807309", category: "Men" },
    { id: 'na-5', name: "White Minimal Polo", price: 849, img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600", category: "Men" },
    { id: 'na-6', name: "Black Cargo Joggers", price: 1299, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600", category: "Men" },
    { id: 'na-7', name: "Oversized Graphic Hoodie", price: 1599, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600", category: "Men" },
    { id: 'na-8', name: "Denim Trucker Jacket", price: 1899, img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600", category: "Men" }
  ];

  return (
    <ProductSlider
      products={products}
      title="New"
      titleHighlight="Arrivals"
      subtitle="Refresh your wardrobe with our latest collection"
      shopLink="/products"
      shopLinkText="Shop New Arrivals"
      showBadge={true}
      badgeText="New Arrival"
    />
  );
};

export default NewArrivals;