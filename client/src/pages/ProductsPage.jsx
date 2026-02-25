/**
 * pages/ProductsPage.jsx
 *
 * The main product catalogue with:
 * - Category filter sidebar
 * - Sort options
 * - Paginated product grid
 * - Search bar
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import ProductCard       from '../components/ProductCard';
import { productService } from '../services/productService';

const SORT_OPTIONS = [
  { label: 'Newest',       value: 'newest' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Top Rated',    value: 'rating' },
  { label: 'Most Popular', value: 'popular' },
];

const CATEGORIES = ['all', 'graphic-tee', 'plain', 'custom', 'oversized', 'crop', 'polo'];

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(1);
  const [loading, setLoading]     = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Controlled filter state from URL
  const category = searchParams.get('category') || 'all';
  const sort     = searchParams.get('sort')     || 'newest';
  const page     = Number(searchParams.get('page')) || 1;
  const search   = searchParams.get('search')   || '';

  // Fetch products whenever filters change
  useEffect(() => {
    setLoading(true);
    const params = { sort, page, limit: 12 };
    if (category !== 'all') params.category = category;
    if (search)             params.search   = search;

    productService.getAll(params)
      .then((res) => {
        setProducts(res.data || []);
        setTotal(res.total || 0);
        setPages(res.pages || 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, sort, page, search]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'all' && value !== 'newest' && value !== 1) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete('page'); // Reset to page 1 when filter changes
    setSearchParams(next);
  };

  return (
    <div className="section-wrapper">

      {/* ── Page header ──────────────────────────────── */}
      <div className="mb-10">
        <span className="tag-orange mb-3 inline-block">The Full Collection</span>
        <h1 className="font-display font-bold text-ink">
          Tees That <span className="gradient-text">Mean Something</span>
        </h1>
        <p className="text-ink/60 mt-2 max-w-lg">
          Browse our collection of premium tees — or scroll past and design your own.
        </p>
      </div>

      {/* ── Search bar ───────────────────────────────── */}
      <div className="relative max-w-md mb-8">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30" size={18} />
        <input
          type="text"
          placeholder="Search tees…"
          defaultValue={search}
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateParam('search', e.target.value);
          }}
          className="form-input pl-11 rounded-full"
        />
        {search && (
          <button
            onClick={() => updateParam('search', '')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      <div className="flex gap-8">

        {/* ── Filter sidebar (desktop) ──────────────── */}
        <aside className="hidden lg:block w-52 flex-shrink-0">
          <div className="sticky top-24">
            <h3 className="text-sm font-accent font-semibold uppercase tracking-wide text-ink/50 mb-3">
              Category
            </h3>
            <ul className="space-y-1">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => updateParam('category', cat)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all
                                ${category === cat
                                  ? 'bg-brand-500 text-white font-semibold'
                                  : 'text-ink/70 hover:bg-cream-dark'
                                }`}
                  >
                    {cat === 'all' ? 'All Tees' : cat.replace('-', ' ')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────── */}
        <div className="flex-1 min-w-0">

          {/* Sort + result count row */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <p className="text-sm text-ink/50">
              {loading ? 'Loading…' : `${total} tees found`}
            </p>
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden btn-secondary text-sm py-2 px-4"
              >
                <FiFilter size={14} /> Filters
              </button>

              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="form-input py-2 w-auto text-sm"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile category filter */}
          {showFilters && (
            <div className="lg:hidden flex flex-wrap gap-2 mb-6 p-4 bg-cream-dark rounded-2xl">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { updateParam('category', cat); setShowFilters(false); }}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all
                              ${category === cat
                                ? 'bg-brand-500 border-brand-500 text-white'
                                : 'border-gray-200 text-ink/60 hover:border-brand-300'
                              }`}
                >
                  {cat === 'all' ? 'All' : cat.replace('-', ' ')}
                </button>
              ))}
            </div>
          )}

          {/* Products grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-cream-dark" style={{ aspectRatio: '3/4' }} />
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-cream-dark rounded w-2/3" />
                    <div className="h-4 bg-cream-dark rounded" />
                    <div className="h-5 bg-cream-dark rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-xl font-semibold text-ink mb-2">No tees found</h3>
              <p className="text-ink/50 text-sm">Try a different search or category.</p>
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.set('page', i + 1);
                    setSearchParams(next);
                  }}
                  className={`w-9 h-9 rounded-full text-sm font-semibold transition-all
                              ${page === i + 1
                                ? 'bg-brand-500 text-white'
                                : 'bg-cream-dark text-ink hover:bg-brand-100'
                              }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
