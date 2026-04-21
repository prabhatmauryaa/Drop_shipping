'use client';
import React from 'react';
import ProductSlider from './ProductSlider';

const MensSection = () => {
  const products = [
    { id: 'men-1', name: "Men Black Denim Oversized Shirt", price: 1247, img: "https://5.imimg.com/data5/ECOM/Default/2023/12/366057172/ZH/ZL/CZ/90086993/msshrt20315-1-7bffa0f8-3096-4baf-8093-91acf207b7b7-500x500.jpg", category: "Men" },
    { id: 'men-2', name: "Men Graphic Print Black T-Shirt", price: 899, img: "https://rukminim2.flixcart.com/image/480/640/xif0q/t-shirt/x/f/6/m-286576-the-souled-store-original-imahg89fyryq8eez.jpeg?q=90", category: "Men" },
    { id: 'men-3', name: "Oversize Hoodie for Men", price: 1499, img: "https://m.media-amazon.com/images/I/915QkKTSKNL._AC_UY1100_.jpg", category: "Men" },
    { id: 'men-4', name: "MONOSTRIPE OVERSIZED T-SHIRT", price: 749, img: "https://www.dimaxio.com/cdn/shop/files/BLACKBACK_64249c97-1a9b-426b-9c94-bad33dfa4fd3.png?v=1767636071&width=533", category: "Men" },
    { id: 'men-5', name: "Classic Black Slim Jeans", price: 1399, img: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600", category: "Men" },
    { id: 'men-6', name: "Bomber Jacket Olive", price: 2199, img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600", category: "Men" },
    { id: 'men-7', name: "Vintage Wash Tee", price: 699, img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600", category: "Men" },
    { id: 'men-8', name: "Streetwear Cargo Shorts", price: 999, img: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?q=80&w=600", category: "Men" }
  ];

  return (
    <ProductSlider
      products={products}
      title="Men's"
      titleHighlight="Shop"
      subtitle="The ultimate flex is wearing something that feels good."
      shopLink="/products?category=Men"
      shopLinkText="Shop Men"
    />
  );
};

export default MensSection;