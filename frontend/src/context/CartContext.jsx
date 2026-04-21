'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('dropsync_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dropsync_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    // Normalize item properties for consistency
    const normalizedItem = {
      ...item,
      _id: item._id || item.id,
      id: item.id || item._id,
      qty: item.qty || item.quantity || 1,
      quantity: item.quantity || item.qty || 1,
      stock: item.stock || 999,
      title: item.title || item.name,
      name: item.name || item.title,
      imageUrl: item.imageUrl || item.img || item.image,
      img: item.img || item.imageUrl || item.image,
      category: item.category || 'Product',
    };

    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === normalizedItem.id || cartItem._id === normalizedItem._id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          (cartItem.id === normalizedItem.id || cartItem._id === normalizedItem._id)
            ? { ...cartItem, qty: (cartItem.qty || 1) + 1, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
      }
      return [...prevCart, normalizedItem];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId && item._id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        (item.id === itemId || item._id === itemId)
          ? { ...item, qty: quantity, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
