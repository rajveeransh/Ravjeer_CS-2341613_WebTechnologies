/**
 * pages/OrderConfirmPage.jsx
 */

import { useEffect, useState } from 'react';
import { useParams, Link }     from 'react-router-dom';
import { orderService }        from '../services/orderService';
import { formatCurrency }      from '../utils/formatCurrency';

const OrderConfirmPage = () => {
  const { id }           = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderService.getById(id).then((r) => setOrder(r.data));
  }, [id]);

  if (!order) return (
    <div className="section-wrapper flex justify-center py-32">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="section-wrapper max-w-2xl">
      {/* Success banner */}
      <div className="text-center mb-12">
        <div className="text-7xl mb-4 animate-bounce">🎉</div>
        <h1 className="font-display font-bold text-ink mb-3">
          Your Tee is on its way!
        </h1>
        <p className="text-ink/60 max-w-md mx-auto">
          We've received your order and our team is already on it.
          You deserve to wear something uniquely yours.
        </p>
      </div>

      {/* Order card */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Order #{order.orderNumber}</h2>
          <span className={`badge ${order.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {order.status}
          </span>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <div className="w-12 h-12 bg-cream-dark rounded-lg flex items-center justify-center text-xl">
                {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" /> : '👕'}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{item.name}</p>
                <p className="text-xs text-ink/50">Qty: {item.quantity} {item.size && `• ${item.size}`}</p>
              </div>
              <p className="text-sm font-bold text-ink">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        {/* Shipping info */}
        <div className="bg-cream rounded-xl p-4">
          <p className="text-xs font-accent text-ink/50 uppercase mb-1">Delivering to</p>
          <p className="text-sm text-ink">
            {order.shippingAddress.name} · {order.shippingAddress.street},
            {order.shippingAddress.city}, {order.shippingAddress.pincode}
          </p>
        </div>

        {/* Total */}
        <div className="flex justify-between font-bold text-ink border-t border-cream-dark pt-4">
          <span>Total Paid</span>
          <span className="text-brand-600">{formatCurrency(order.totalPrice)}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4 mt-8 justify-center">
        <Link to="/dashboard" className="btn-secondary">View My Orders</Link>
        <Link to="/products"  className="btn-primary">Shop More</Link>
      </div>
    </div>
  );
};

export default OrderConfirmPage;
