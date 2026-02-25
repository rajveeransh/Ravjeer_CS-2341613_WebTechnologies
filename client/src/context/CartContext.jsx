/**
 * context/CartContext.jsx
 *
 * Global cart state management.
 * Cart items persist in localStorage between sessions.
 *
 * Each cart item shape:
 * {
 *   _id, name, image, price, size, color, quantity, customDesign?
 * }
 */

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Restore cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rupkala_cart');
    if (saved) setCartItems(JSON.parse(saved));
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem('rupkala_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ── Unique key for a cart item (product + size + color) ─
  const itemKey = (item) => `${item._id}-${item.size || ''}-${item.color || ''}`;

  // ── Add to cart ──────────────────────────────────────────
  const addToCart = (item, quantity = 1) => {
    setCartItems((prev) => {
      const key      = itemKey(item);
      const existing = prev.find((i) => itemKey(i) === key);

      if (existing) {
        toast.success('Quantity updated in cart!');
        return prev.map((i) =>
          itemKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        toast.success(`"${item.name}" added to cart 🛒`);
        return [...prev, { ...item, quantity }];
      }
    });
  };

  // ── Remove from cart ─────────────────────────────────────
  const removeFromCart = (item) => {
    setCartItems((prev) => prev.filter((i) => itemKey(i) !== itemKey(item)));
    toast.success('Item removed from cart.');
  };

  // ── Update quantity ──────────────────────────────────────
  const updateQuantity = (item, quantity) => {
    if (quantity < 1) return removeFromCart(item);
    setCartItems((prev) =>
      prev.map((i) => (itemKey(i) === itemKey(item) ? { ...i, quantity } : i))
    );
  };

  // ── Clear entire cart ────────────────────────────────────
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('rupkala_cart');
  };

  // ── Computed values ──────────────────────────────────────
  const cartCount    = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const itemsPrice   = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingPrice = itemsPrice >= 999 ? 0 : 79;   // Free shipping over ₹999
  const taxPrice      = Math.round(itemsPrice * 0.18); // 18% GST
  const totalPrice    = itemsPrice + shippingPrice + taxPrice;

  const value = {
    cartItems,
    cartCount,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
