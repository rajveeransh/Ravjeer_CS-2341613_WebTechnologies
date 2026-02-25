/**
 * pages/DashboardPage.jsx
 * User's personal area: orders + saved designs.
 */

import { useEffect, useState } from 'react';
import { Link }                from 'react-router-dom';
import { FiPackage, FiHeart, FiUser } from 'react-icons/fi';
import { useAuth }         from '../context/AuthContext';
import { orderService }    from '../services/orderService';
import { designService }   from '../services/designService';
import { formatCurrency }  from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders]       = useState([]);
  const [designs, setDesigns]     = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      orderService.getMyOrders(),
      designService.getMine(),
    ]).then(([ordRes, desRes]) => {
      setOrders(ordRes.data || []);
      setDesigns(desRes.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleDeleteDesign = async (id) => {
    try {
      await designService.delete(id);
      setDesigns((prev) => prev.filter((d) => d._id !== id));
      toast.success('Design deleted.');
    } catch {
      toast.error('Could not delete design.');
    }
  };

  const STATUS_COLORS = {
    pending:    'bg-yellow-100 text-yellow-700',
    confirmed:  'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped:    'bg-orange-100 text-orange-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-600',
  };

  const tabs = [
    { id: 'orders',  label: 'My Orders',  icon: <FiPackage size={16} />,  count: orders.length  },
    { id: 'designs', label: 'My Designs', icon: <FiHeart size={16} />,   count: designs.length },
    { id: 'profile', label: 'Profile',    icon: <FiUser size={16} />,    count: null },
  ];

  return (
    <div className="section-wrapper max-w-5xl">

      {/* Welcome header */}
      <div className="mb-10">
        <span className="tag-orange mb-3 inline-block">Your Space</span>
        <h1 className="font-display font-bold text-ink">
          Hey, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-ink/60 mt-2">Here's everything that's yours on Rupkala.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-cream-dark pb-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all
                        ${activeTab === tab.id
                          ? 'border-brand-500 text-brand-500'
                          : 'border-transparent text-ink/50 hover:text-ink'}`}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== null && (
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs
                               ${activeTab === tab.id ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-500'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* ── ORDERS TAB ──────────────────────────── */}
          {activeTab === 'orders' && (
            <div>
              {orders.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-4xl mb-4">📦</p>
                  <h3 className="text-lg font-semibold text-ink mb-2">No orders yet</h3>
                  <p className="text-sm text-ink/50 mb-6">Your first Rupkala tee is waiting for you.</p>
                  <Link to="/products" className="btn-primary">Shop Now</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order._id} className="card p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-bold text-ink">Order #{order.orderNumber}</p>
                          <p className="text-xs text-ink/40 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric'
                            })}
                          </p>
                        </div>
                        <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-3 mb-3">
                        {order.orderItems.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-ink/60">
                            <span className="text-base">👕</span>
                            {item.name} × {item.quantity}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between border-t border-cream-dark pt-3">
                        <p className="text-sm font-bold text-ink">{formatCurrency(order.totalPrice)}</p>
                        <Link to={`/order-confirm/${order._id}`} className="text-xs text-brand-500 hover:text-brand-600 font-medium">
                          View details →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── DESIGNS TAB ─────────────────────────── */}
          {activeTab === 'designs' && (
            <div>
              {designs.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-4xl mb-4">🎨</p>
                  <h3 className="text-lg font-semibold text-ink mb-2">No saved designs</h3>
                  <p className="text-sm text-ink/50 mb-6">Create your first custom tee design.</p>
                  <Link to="/design" className="btn-primary">Open Design Studio</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {designs.map((design) => (
                    <div key={design._id} className="card p-4">
                      <div className="bg-cream-dark rounded-xl aspect-square mb-3 flex items-center justify-center relative">
                        {design.previewImage ? (
                          <img src={design.previewImage} alt={design.title} className="w-full h-full object-contain rounded-xl" />
                        ) : (
                          <div className="text-4xl opacity-30">🎨</div>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-ink mb-1">{design.title}</p>
                      <p className="text-xs text-ink/40 mb-3">
                        {design.product?.name || 'Custom Tee'} · {design.printPosition}
                      </p>
                      <div className="flex gap-2">
                        <Link
                          to={`/design?product=${design.product?._id}&designId=${design._id}`}
                          className="btn-ghost text-xs"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteDesign(design._id)}
                          className="text-xs text-red-400 hover:text-red-500 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PROFILE TAB ─────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="max-w-md">
              <div className="card p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-brand-500 text-white text-2xl font-bold flex items-center justify-center">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-ink">{user?.name}</p>
                    <p className="text-sm text-ink/50">{user?.email}</p>
                    <span className="tag-orange text-xs mt-1 inline-block">{user?.role}</span>
                  </div>
                </div>
                <div className="border-t border-cream-dark pt-5 space-y-3">
                  <p className="text-xs font-accent text-ink/40 uppercase tracking-wide">Account Stats</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-cream-dark rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-brand-500">{orders.length}</p>
                      <p className="text-xs text-ink/50 mt-1">Orders</p>
                    </div>
                    <div className="bg-cream-dark rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-brand-500">{designs.length}</p>
                      <p className="text-xs text-ink/50 mt-1">Saved Designs</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-ink/30 text-center">
                  Member since {new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
