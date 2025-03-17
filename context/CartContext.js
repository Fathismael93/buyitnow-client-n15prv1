/* eslint-disable react/prop-types */
'use client';

import React, { createContext, useState } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [orderInfo, setOrderInfo] = useState(null);

  const setCartToState = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`);
      const data = await res.json();

      if (data) {
        setCart(data?.cart);
        setCartCount(data?.cartCount);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        loading,
        cart,
        cartCount,
        orderInfo,
        setLoading,
        setCartToState,
        setOrderInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
