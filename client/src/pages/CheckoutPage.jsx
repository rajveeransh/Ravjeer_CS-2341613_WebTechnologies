/**
 * pages/CheckoutPage.jsx
 *
 * Multi-step checkout: Shipping → Review → Payment (dummy)
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLock } from 'react-icons/fi';
import { useCart }        from '../context/CartContext';
import { useAuth }        from '../context/AuthContext';
import { orderService }   from '../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Review', 'Payment'];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart
  } = useCart();

  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    name:    user?.name || '',
    street:  '',
    city:    '',
    state:   '',
    pincode: '',
    phone:   '',
  });

  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product:  item._id,
          name:     item.name,
          image:    item.image,
          price:    item.price,
          quantity: item.quantity,
          size:     item.size,
          color:    item.color,
        })),
        shippingAddress: shipping,
        paymentMethod:   'Razorpay',
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      const res   = await orderService.create(orderData);
      const order = res.data;

      // Simulate payment
      await orderService.pay(order._id);

      clearCart();
      toast.success('🎉 Order placed and payment confirmed!');
      navigate(`/order-confirm/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="section-wrapper text-center py-32">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="font-display font-bold text-ink mb-3">Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="btn-primary">Shop Tees</button>
      </div>
    );
  }

  return (
    <div className="section-wrapper max-w-4xl">
      {/* Step indicators */}
      <div className="flex items-center justify-center gap-3 mb-12">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`flex items-center gap-2 ${i <= step ? 'text-brand-500' : 'text-ink/30'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                              ${i < step ? 'bg-brand-500 text-white' :
                                i === step ? 'bg-brand-500 text-white ring-4 ring-brand-200' :
                                'bg-gray-100 text-gray-400'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 h-0.5 ${i < step ? 'bg-brand-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Main checkout area ─────────────────────── */}
        <div className="lg:col-span-2">

          {/* STEP 0: Shipping */}
          {step === 0 && (
            <div className="card p-6 space-y-5">
              <h2 className="text-xl font-display font-bold text-ink">Shipping Details</h2>
              {['name', 'street', 'city', 'state', 'pincode', 'phone'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-ink mb-1.5 capitalize">
                    {field === 'street' ? 'Street Address' : field}
                  </label>
                  <input
                    type={field === 'phone' ? 'tel' : 'text'}
                    name={field}
                    value={shipping[field]}
                    onChange={handleShippingChange}
                    placeholder={field === 'street' ? '123 MG Road, Flat 4B' : ''}
                    className="form-input"
                    required
                  />
                </div>
              ))}
              <button
                onClick={() => setStep(1)}
                disabled={!Object.values(shipping).every(Boolean)}
                className="btn-primary w-full py-4"
              >
                Continue to Review <FiArrowRight size={16} />
              </button>
            </div>
          )}

          {/* STEP 1: Review order */}
          {step === 1 && (
            <div className="card p-6 space-y-5">
              <h2 className="text-xl font-display font-bold text-ink">Review Your Order</h2>
              <div className="space-y-3">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-cream rounded-xl">
                    <div className="w-14 h-14 rounded-xl bg-cream-dark flex items-center justify-center text-2xl flex-shrink-0">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-xl" /> : '👕'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">{item.name}</p>
                      <p className="text-xs text-ink/50">
                        {item.size && `Size: ${item.size}`} {item.color && `• ${item.color}`}
                      </p>
                      <p className="text-sm font-bold text-brand-600 mt-1">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-cream-dark">
                <p className="text-xs font-accent text-ink/50 uppercase mb-2">Shipping to</p>
                <p className="text-sm text-ink">{shipping.name} — {shipping.street}, {shipping.city}, {shipping.state} {shipping.pincode}</p>
                <p className="text-sm text-ink/60">{shipping.phone}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="btn-secondary flex-1 py-3">← Back</button>
                <button onClick={() => setStep(2)} className="btn-primary flex-1 py-3">
                  Go to Payment <FiArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Dummy payment */}
          {step === 2 && (
            <div className="card p-6 space-y-5">
              <h2 className="text-xl font-display font-bold text-ink">Payment</h2>

              <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4">
                <p className="text-sm text-brand-700 font-semibold">🔒 Simulated Razorpay Gateway</p>
                <p className="text-xs text-brand-600 mt-1">
                  This is a university project demo. No real payment is processed.
                </p>
              </div>

              {/* Dummy card UI */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">Card Number</label>
                  <input type="text" defaultValue="4111 1111 1111 1111" readOnly className="form-input bg-cream font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">Expiry</label>
                    <input type="text" defaultValue="12/26" readOnly className="form-input bg-cream" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink mb-1.5">CVV</label>
                    <input type="text" defaultValue="***" readOnly className="form-input bg-cream" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-primary flex-1 py-3"
                >
                  <FiLock size={15} />
                  {loading ? 'Processing…' : `Pay ${formatCurrency(totalPrice)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Order summary sidebar ──────────────────── */}
        <div className="card p-5 h-fit sticky top-24">
          <h3 className="font-semibold text-ink mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between text-ink/60"><span>Items ({cartItems.length})</span><span>{formatCurrency(itemsPrice)}</span></div>
            <div className="flex justify-between text-ink/60"><span>Shipping</span><span>{shippingPrice === 0 ? 'Free' : formatCurrency(shippingPrice)}</span></div>
            <div className="flex justify-between text-ink/60"><span>GST (18%)</span><span>{formatCurrency(taxPrice)}</span></div>
            <div className="flex justify-between font-bold text-ink text-base border-t border-cream-dark pt-2 mt-2">
              <span>Total</span><span className="text-brand-600">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
          <p className="text-xs text-ink/40 text-center">
            🔒 100% secure checkout. Your data is safe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
