/**
 * components/CartDrawer.jsx
 *
 * Slide-in cart panel from the right side.
 * Shows all cart items with quantity controls,
 * price breakdown, and a Checkout button.
 */

import { useNavigate } from 'react-router-dom';
import { FiX, FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 z-40 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-dark">
          <div>
            <h2 className="text-xl font-display font-bold text-ink">Your Cart</h2>
            <p className="text-xs text-ink/40 mt-0.5 font-accent">
              {cartCount} {cartCount === 1 ? 'item' : 'items'} waiting for you
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-cream-dark transition-colors"
            aria-label="Close cart"
          >
            <FiX size={22} className="text-ink" />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="text-6xl">🛒</div>
              <h3 className="text-lg font-display font-semibold text-ink">
                Your cart feels lonely
              </h3>
              <p className="text-sm text-ink/50">
                Add a tee that tells your story and it'll show up right here.
              </p>
              <button
                onClick={() => { setIsCartOpen(false); navigate('/products'); }}
                className="btn-primary mt-2"
              >
                Explore Tees
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={`${item._id}-${item.size}-${item.color}-${index}`}
                   className="flex gap-4 p-3 rounded-2xl hover:bg-cream transition-colors">

                {/* Thumbnail */}
                <div className="w-20 h-20 rounded-xl bg-cream-dark overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">👕</div>
                  )}
                </div>

                {/* Item details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink leading-snug line-clamp-2">{item.name}</p>
                  <div className="flex gap-2 mt-1">
                    {item.size  && <span className="text-xs text-ink/50">Size: {item.size}</span>}
                    {item.color && <span className="text-xs text-ink/50">• {item.color}</span>}
                  </div>
                  <p className="text-sm font-bold text-brand-600 mt-1">
                    {formatCurrency(item.price)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-cream-dark hover:bg-brand-100 flex items-center justify-center transition-colors"
                    >
                      <FiMinus size={13} />
                    </button>
                    <span className="text-sm font-semibold text-ink w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-cream-dark hover:bg-brand-100 flex items-center justify-center transition-colors"
                    >
                      <FiPlus size={13} />
                    </button>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item)}
                  className="self-start p-1.5 text-ink/30 hover:text-red-400 transition-colors"
                  aria-label="Remove item"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer: price summary + checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-cream-dark px-6 py-5 space-y-3">
            {/* Price breakdown */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-ink/60">
                <span>Subtotal</span>
                <span>{formatCurrency(itemsPrice)}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>Shipping {shippingPrice === 0 && <span className="text-green-600">(Free!)</span>}</span>
                <span>{shippingPrice === 0 ? 'Free' : formatCurrency(shippingPrice)}</span>
              </div>
              <div className="flex justify-between text-ink/60">
                <span>GST (18%)</span>
                <span>{formatCurrency(taxPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-ink text-base pt-2 border-t border-cream-dark">
                <span>Total</span>
                <span className="text-brand-600">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            {/* Shipping nudge */}
            {itemsPrice < 999 && (
              <p className="text-xs text-center text-ink/50 bg-brand-50 rounded-lg py-2 px-3">
                🎉 Add {formatCurrency(999 - itemsPrice)} more for free shipping!
              </p>
            )}

            {/* Checkout CTA */}
            <button onClick={handleCheckout} className="btn-primary w-full py-3.5 text-base">
              <FiShoppingBag size={18} />
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
