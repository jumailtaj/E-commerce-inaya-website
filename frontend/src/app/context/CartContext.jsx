import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => item && item.product && (item.product._id || item.product.id));
        }
      }
      return [];
    } catch (e) {
      console.warn("Error parsing cart from localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback((product, quantity) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => (item.product._id || item.product.id) === (product._id || product.id));
      const stockAvailable = product.inventory !== undefined ? product.inventory : (product.stock !== undefined ? product.stock : 99);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > stockAvailable) {
          toast.warning(`Cannot add more. Only ${stockAvailable} items in stock.`);
          return prevItems.map((item) =>
            (item.product._id || item.product.id) === (product._id || product.id)
              ? { ...item, quantity: stockAvailable }
              : item
          );
        }
        return prevItems.map((item) =>
          (item.product._id || item.product.id) === (product._id || product.id)
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      if (quantity > stockAvailable) {
        toast.warning(`Only ${stockAvailable} items available in stock.`);
        return [...prevItems, { product, quantity: stockAvailable }];
      }
      
      return [...prevItems, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => (item.product._id || item.product.id) !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems((prevItems) => {
      const itemToUpdate = prevItems.find(item => (item.product._id || item.product.id) === productId);
      const stockAvailable = itemToUpdate?.product.inventory !== undefined ? itemToUpdate.product.inventory : (itemToUpdate?.product.stock !== undefined ? itemToUpdate.product.stock : 99);
      
      if (quantity > stockAvailable) {
        toast.warning(`Maximum stock reached (${stockAvailable})`);
        return prevItems.map((item) =>
          (item.product._id || item.product.id) === productId ? { ...item, quantity: stockAvailable } : item
        );
      }
      
      return prevItems.map((item) =>
        (item.product._id || item.product.id) === productId ? { ...item, quantity } : item
      );
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
