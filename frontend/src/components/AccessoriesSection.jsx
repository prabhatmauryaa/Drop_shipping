'use client';
import React from 'react';
import ProductSlider from './ProductSlider';

const AccessoriesSection = () => {
  const products = [
    { 
      id: 'acc-1', 
      name: "ARCHIVE ACETATE SUNGLASSES", 
      price: 2499, 
      img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
      category: "Accessories"
    },
    { 
      id: 'acc-2', 
      name: "LEATHER CARDHOLDER", 
      price: 1899, 
      img: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop",
      category: "Accessories"
    },
    { 
      id: 'acc-3', 
      name: "SILVER CUBAN LINK CHAIN", 
      price: 5479, 
      img: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800&auto=format&fit=crop",
      category: "Accessories"
    },
    { 
      id: 'acc-4', 
      name: "Trendy Bracelet For Men's", 
      price: 2849, 
      img: "https://tohfajewellery.in/cdn/shop/files/ESKU301901191.jpg?crop=center&height=940&v=1744866973&width=940",
      category: "Accessories"
    },
    { 
      id: 'acc-5', 
      name: "CLASSIC LEATHER BELT", 
      price: 1599, 
      img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600",
      category: "Accessories"
    },
    { 
      id: 'acc-6', 
      name: "CANVAS TOTE BAG", 
      price: 1299, 
      img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600",
      category: "Accessories"
    },
    { 
      id: 'acc-7', 
      name: "MINIMAL WRISTWATCH", 
      price: 3999, 
      img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600",
      category: "Accessories"
    },
    { 
      id: 'acc-8', 
      name: "BEANIE CAP BLACK", 
      price: 599, 
      img: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600",
      category: "Accessories"
    }
  ];

  return (
    <ProductSlider
      products={products}
      title="Essentials"
      titleHighlight="& Objects"
      subtitle="The final detail. Precision-made objects."
      shopLink="/products?category=Accessories"
      shopLinkText="Explore All"
    />
  );
};

export default AccessoriesSection;