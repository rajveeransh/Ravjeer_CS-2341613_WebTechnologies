/**
 * main.jsx – Rupkala React Application Bootstrap
 *
 * Wraps the entire application in:
 * - BrowserRouter (client-side routing)
 * - AuthProvider (global auth state)
 * - CartProvider (global cart state)
 * - Toaster (toast notifications)
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#1a1a2e',
                color:      '#fff',
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize:   '14px',
              },
              success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
