/**
 * pages/admin/AdminDashboard.jsx
 * Overview stats + quick links for admin users.
 */

import { useEffect, useState } from 'react';
import { Link }               from 'react-router-dom';
import { FiUsers, FiPackage, FiShoppingBag, FiDollarSign } from 'react-icons/fi';
import { adminService }    from '../../services/adminService';
import { formatCurrency }  from '../../utils/formatCurrency';

const AdminDashboard = () => {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((r) => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const STATUS_COLORS = {
    pending:    'bg-yellow-100 text-yellow-700',
    confirmed:  'bg-blue-100 text-blue-700',
    shipped:    'bg-orange-100 text-orange-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-600',
  };

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const STAT_CARDS = [
    { label: 'Total Users',    value: stats?.totalUsers,    icon: <FiUsers size={24} />,      color: 'text-blue-500',  bg: 'bg-blue-50'   },
    { label: 'Products',       value: stats?.totalProducts, icon: <FiShoppingBag size={24} />, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Orders',         value: stats?.totalOrders,   icon: <FiPackage size={24} />,     color: 'text-brand-500',  bg: 'bg-brand-50'  },
    { label: 'Revenue',        value: formatCurrency(stats?.totalRevenue || 0), icon: <FiDollarSign size={24} />, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <div className="section-wrapper">
      <div className="mb-10">
        <span className="tag-orange mb-3 inline-block">Control Center</span>
        <h1 className="font-display font-bold text-ink">Admin Dashboard</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`w-12 h-12 rounded-xl ${s.bg} ${s.color} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-ink">{s.value}</p>
            <p className="text-xs text-ink/50 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        <Link to="/admin/products" className="card p-5 hover:border-brand-300 border-2 border-transparent transition-all">
          <h3 className="font-semibold text-ink mb-1">Manage Products</h3>
          <p className="text-xs text-ink/50">Add, edit or deactivate products in the catalogue.</p>
        </Link>
        <Link to="/admin/orders" className="card p-5 hover:border-brand-300 border-2 border-transparent transition-all">
          <h3 className="font-semibold text-ink mb-1">Manage Orders</h3>
          <p className="text-xs text-ink/50">Update order status and view fulfilment queue.</p>
          {stats?.pendingOrders > 0 && (
            <span className="badge bg-red-100 text-red-600 mt-2">{stats.pendingOrders} pending</span>
          )}
        </Link>
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="text-xl font-display font-bold text-ink mb-5">Recent Orders</h2>
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-dark text-left">
                <th className="px-5 py-3 font-semibold text-ink/60">Order #</th>
                <th className="px-5 py-3 font-semibold text-ink/60">Customer</th>
                <th className="px-5 py-3 font-semibold text-ink/60">Total</th>
                <th className="px-5 py-3 font-semibold text-ink/60">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {(stats?.recentOrders || []).map((order) => (
                <tr key={order._id} className="hover:bg-cream transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-ink">{order.orderNumber}</td>
                  <td className="px-5 py-3 text-ink">{order.user?.name || '—'}</td>
                  <td className="px-5 py-3 font-bold text-ink">{formatCurrency(order.totalPrice)}</td>
                  <td className="px-5 py-3">
                    <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
