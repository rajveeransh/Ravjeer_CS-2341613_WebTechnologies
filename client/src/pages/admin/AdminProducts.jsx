/**
 * pages/admin/AdminProducts.jsx
 * Full CRUD for products.
 */

import { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiCheck } from 'react-icons/fi';
import { adminService }   from '../../services/adminService';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

const BLANK = {
  name: '', tagline: '', description: '', price: '', salePrice: '',
  category: 'graphic-tee', isFeatured: false, allowCustomDesign: true,
  images: [''],
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]         = useState(BLANK);
  const [saving, setSaving]     = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    fetch('/api/products?limit=100').then(r => r.json())
      .then((r) => setProducts(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(fetchProducts, []);

  const openCreate = () => { setForm(BLANK); setEditingId(null); setShowForm(true); };
  const openEdit   = (p)  => {
    setForm({ ...p, salePrice: p.salePrice || '', images: p.images?.length ? p.images : [''] });
    setEditingId(p._id); setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const payload = {
        ...form,
        price:     Number(form.price),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
        images:    (form.images || []).filter(Boolean),
      };
      if (editingId) {
        await adminService.updateProduct(editingId, payload);
        toast.success('Product updated!');
      } else {
        await adminService.createProduct(payload);
        toast.success('Product created!');
      }
      setShowForm(false); fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this product?')) return;
    try { await adminService.deleteProduct(id); toast.success('Deactivated.'); fetchProducts(); }
    catch { toast.error('Failed.'); }
  };

  return (
    <div className="section-wrapper">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-ink">Products</h1>
        <button onClick={openCreate} className="btn-primary"><FiPlus size={16} /> Add Product</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream-dark text-left text-ink/60">
                <th className="px-5 py-3 font-semibold">Product</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Price</th>
                <th className="px-5 py-3 font-semibold">Featured</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-cream transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cream-dark overflow-hidden flex-shrink-0 flex items-center justify-center text-lg">
                        {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : '👕'}
                      </div>
                      <span className="font-medium text-ink">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink/60 capitalize">{p.category?.replace('-',' ')}</td>
                  <td className="px-5 py-3 font-bold">{formatCurrency(p.price)}</td>
                  <td className="px-5 py-3">
                    {p.isFeatured ? <FiCheck className="text-green-500" /> : <FiX className="text-gray-300" />}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-brand-50 text-brand-500 transition-colors"><FiEdit2 size={15} /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 transition-colors"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg my-8 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-dark">
              <h2 className="text-lg font-display font-bold text-ink">{editingId ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-cream-dark rounded-full"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { name: 'name',        label: 'Product Name',  type: 'text',   required: true },
                { name: 'tagline',     label: 'Tagline',       type: 'text' },
                { name: 'price',       label: 'Price (₹)',     type: 'number', required: true },
                { name: 'salePrice',   label: 'Sale Price (₹, optional)', type: 'number' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="block text-xs font-semibold text-ink/50 uppercase mb-1">{f.label}</label>
                  <input type={f.type} name={f.name} value={form[f.name] || ''} onChange={handleChange} required={f.required} className="form-input" />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-ink/50 uppercase mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="form-input resize-none" required />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink/50 uppercase mb-1">Category</label>
                <select name="category" value={form.category} onChange={handleChange} className="form-input">
                  {['graphic-tee','plain','custom','oversized','crop','polo'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink/50 uppercase mb-1">Image URL (first image)</label>
                <input type="text" value={form.images?.[0] || ''} onChange={(e) => setForm((p) => ({ ...p, images: [e.target.value] }))} className="form-input" placeholder="https://…" />
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="isFeatured" checked={!!form.isFeatured} onChange={handleChange} className="accent-brand-500" />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="allowCustomDesign" checked={!!form.allowCustomDesign} onChange={handleChange} className="accent-brand-500" />
                  Allow Custom Design
                </label>
              </div>

              <button type="submit" className="btn-primary w-full py-3.5" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
