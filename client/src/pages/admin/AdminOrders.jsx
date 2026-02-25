/**
 * pages/admin/AdminOrders.jsx
 * View all orders and update status.
 */

import { useEffect, useState } from 'react';
import { adminService }   from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  pending:    'bg-yellow-100 text-yellow-700',
  confirmed:  'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped:    'bg-orange-100 text-orange-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-600',
};

const AdminOrders = () => {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchOrders = (status = '') => {
    setLoading(true);
    adminService.getAllOrders(status ? { status } : {})
      .then((r) => setOrders(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => fetchOrders(filter), [filter]);

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      await adminService.updateOrderStatus(id, newStatus);
      toast.success(`Order updated to "${newStatus}"`);
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status: newStatus } : o));
    } catch {
      toast.error('Update failed.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="section-wrapper">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-display font-bold text-ink">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="form-input w-auto text-sm">
          <option value="">All Orders</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-ink/50">No orders found.</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-dark text-left text-ink/60">
                {['Order #', 'Customer', 'Date', 'Total', 'Payment', 'Status', 'Update'].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-cream transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-ink">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-ink">{order.user?.name || '—'}</td>
                  <td className="px-4 py-3 text-ink/60">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3 font-bold text-ink">{formatCurrency(order.totalPrice)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${order.isPaid ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      disabled={updating === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand-400"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
