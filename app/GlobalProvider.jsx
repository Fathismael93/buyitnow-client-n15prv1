'use client';

import { CartProvider } from '@/context/CartContext';
import { SessionProvider } from 'next-auth/react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function GlobalProvider({ children }) {
  return (
    <>
      <ToastContainer position="bottom-right" />
      <CartProvider>
        <SessionProvider>{children}</SessionProvider>
      </CartProvider>
    </>
  );
}
