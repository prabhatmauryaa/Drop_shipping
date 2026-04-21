'use client';
import React from 'react';
import ProductSlider from './ProductSlider';

const WomensSection = () => {
  const products = [
    { 
      id: 'w-1', 
      name: "Women Olive Printed Oversized T-Shirt", 
      price: 799, 
      img: "https://pictures.kartmax.in/live/sites/aPfvUDpPwMn1ZadNKhP7/product-images/TTTS001811_1.JPG",
      category: "Women"
    },
    { 
      id: 'w-2', 
      name: "VINTAGE STREETWEAR FIT", 
      price: 899, 
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
      category: "Women"
    },
    { 
      id: 'w-3', 
      name: "plain oversized hoddie", 
      price: 799, 
      img: "https://www.noughtsandkisses.co.uk/cdn/shop/files/20250916_N_K_AW_ECOM_CS9499.jpg?v=1758205027&width=1920",
      category: "Women"
    },
    { 
      id: 'w-4', 
      name: "OVERSIZED SHIRT", 
      price: 999, 
      img: "https://stylequotient.co.in/cdn/shop/files/SS25SQHASTI_GRWH-1_1200x1200.jpg?v=1737434343",
      category: "Women"
    },
    { 
      id: 'w-5', 
      name: "Floral Summer Dress", 
      price: 1299, 
      img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600",
      category: "Women"
    },
    { 
      id: 'w-6', 
      name: "Casual Linen Top", 
      price: 649, 
      img: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?q=80&w=600",
      category: "Women"
    },
    { 
      id: 'w-7', 
      name: "High Waist Tailored Pants", 
      price: 1499, 
      img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600",
      category: "Women"
    },
    { 
      id: 'w-8', 
      name: "Cropped Denim Jacket", 
      price: 1799, 
      img: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=600",
      category: "Women"
    }
  ];

  return (
    <ProductSlider
      products={products}
      title="Women's"
      titleHighlight="Shop"
      subtitle="The ultimate flex is wearing something that feels good."
      shopLink="/products?category=Women"
      shopLinkText="Shop Women"
    />
  );
};

export default WomensSection;