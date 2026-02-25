/**
 * pages/ProductDetailPage.jsx
 *
 * Individual product view:
 * - Image gallery
 * - Size selector
 * - Colour selector
 * - Add to cart
 * - Custom design CTA
 * - Reviews section
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart, FiArrowRight } from 'react-icons/fi';
import { productService }  from '../services/productService';
import { useCart }         from '../context/CartContext';
import { useAuth }         from '../context/AuthContext';
import { formatCurrency }  from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id }               = useParams();
  const { addToCart }        = useCart();
  const { isAuthenticated }  = useAuth();

  const [product, setProduct]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize]   = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity]     = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    productService.getById(id)
      .then((res) => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="section-wrapper flex justify-center py-32">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="section-wrapper text-center py-32">
      <p className="text-4xl mb-4">😔</p>
      <h2 className="font-display font-bold text-ink mb-3">Product Not Found</h2>
      <Link to="/products" className="btn-primary">Back to Shop</Link>
    </div>
  );

  const displayPrice = product.salePrice ?? product.price;
  const isOnSale     = !!product.salePrice;

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size first.');
      return;
    }
    addToCart({
      _id:   product._id,
      name:  product.name,
      image: product.images?.[0] || '',
      price: displayPrice,
      size:  selectedSize,
      color: selectedColor,
      slug:  product.slug,
    }, quantity);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please log in to leave a review.'); return; }
    setSubmitting(true);
    try {
      await productService.addReview(product._id, { rating: reviewRating, comment: reviewText });
      toast.success('Review submitted! Thank you 🙏');
      setReviewText('');
      // Refresh product to show new review
      const res = await productService.getById(id);
      setProduct(res.data);
    } catch {
      toast.error('Could not submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section-wrapper">

      {/* ── Breadcrumb ───────────────────────────────── */}
      <nav className="text-xs text-ink/40 mb-8 font-accent">
        <Link to="/products" className="hover:text-brand-500">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* ── Image gallery ─────────────────────────── */}
        <div>
          {/* Main image */}
          <div className="rounded-3xl overflow-hidden bg-cream-dark aspect-square mb-3">
            {product.images?.[activeImage] ? (
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-7xl">👕</div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all
                              ${activeImage === i ? 'border-brand-500' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product info ───────────────────────────── */}
        <div>
          <span className="tag-orange mb-3 inline-block">
            {product.category?.replace('-', ' ')}
          </span>

          <h1 className="text-3xl font-display font-bold text-ink mb-2">
            {product.name}
          </h1>

          {product.tagline && (
            <p className="text-ink/50 italic mb-4">"{product.tagline}"</p>
          )}

          {/* Rating */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} size={15}
                    className={i < Math.round(product.rating) ? 'text-brand-500 fill-brand-500' : 'text-gray-200'} />
                ))}
              </div>
              <span className="text-sm text-ink/50">({product.numReviews} reviews)</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-ink">{formatCurrency(displayPrice)}</span>
            {isOnSale && (
              <>
                <span className="text-lg line-through text-ink/30">{formatCurrency(product.price)}</span>
                <span className="tag-orange">
                  {Math.round((1 - displayPrice / product.price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-ink/70 leading-relaxed mb-6">{product.description}</p>

          {/* Colour selector */}
          {product.colors?.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-accent font-semibold text-ink/50 uppercase tracking-wider mb-2">
                Colour {selectedColor && <span className="text-brand-500 normal-case">– {selectedColor}</span>}
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all
                                ${selectedColor === c.name ? 'border-brand-500 scale-110' : 'border-gray-200'}`}
                    style={{ backgroundColor: c.hexCode || '#ccc' }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-accent font-semibold text-ink/50 uppercase tracking-wider mb-2">Size</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => setSelectedSize(s.label)}
                    disabled={s.stock === 0}
                    className={`w-12 h-12 rounded-xl text-sm font-semibold border-2 transition-all
                                ${s.stock === 0 ? 'border-gray-100 text-gray-300 cursor-not-allowed line-through' :
                                  selectedSize === s.label
                                    ? 'border-brand-500 bg-brand-500 text-white'
                                    : 'border-gray-200 text-ink hover:border-brand-300'
                                }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-6">
            <p className="text-xs font-accent font-semibold text-ink/50 uppercase tracking-wider">Qty</p>
            <div className="flex items-center gap-2 bg-cream-dark rounded-xl px-3 py-2">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-ink/50 hover:text-ink">−</button>
              <span className="text-sm font-semibold text-ink w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="text-ink/50 hover:text-ink">+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button onClick={handleAddToCart} className="btn-primary flex-1 py-4">
              <FiShoppingCart size={18} /> Add to Cart
            </button>
            <button className="btn-secondary p-4">
              <FiHeart size={18} />
            </button>
          </div>

          {/* Custom design CTA */}
          {product.allowCustomDesign && (
            <Link
              to={`/design?product=${product._id}`}
              className="flex items-center justify-between w-full p-4 rounded-2xl
                         bg-gradient-to-r from-brand-50 to-cream-dark border border-brand-200
                         hover:border-brand-400 transition-all group"
            >
              <div>
                <p className="text-sm font-semibold text-ink">Add your own design</p>
                <p className="text-xs text-ink/50 mt-0.5">Upload art, add text, choose position</p>
              </div>
              <FiArrowRight size={18} className="text-brand-500 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}

          {/* Product details */}
          <div className="mt-6 pt-6 border-t border-cream-dark grid grid-cols-2 gap-3">
            {[
              { label: 'Fabric',   value: product.details?.fabric },
              { label: 'Fit',      value: product.details?.fit },
              { label: 'Wash',     value: product.details?.washCare },
              { label: 'Weight',   value: product.details?.weight },
            ].map((d) => d.value && (
              <div key={d.label}>
                <p className="text-xs font-accent text-ink/40 uppercase">{d.label}</p>
                <p className="text-sm text-ink mt-0.5">{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reviews section ───────────────────────────── */}
      <section className="mt-20">
        <h2 className="text-2xl font-display font-bold text-ink mb-8">
          What People Are Saying
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Review list */}
          <div className="space-y-5">
            {product.reviews?.length > 0 ? product.reviews.map((r) => (
              <div key={r._id} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{r.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar key={i} size={12}
                          className={i < r.rating ? 'text-brand-500 fill-brand-500' : 'text-gray-200'} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-ink/70 italic">"{r.comment}"</p>
              </div>
            )) : (
              <p className="text-ink/40 text-sm">No reviews yet. Be the first!</p>
            )}
          </div>

          {/* Write a review */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-ink mb-4">Leave a Review</h3>
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <p className="text-xs font-accent text-ink/50 mb-2">Your Rating</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button key={r} type="button" onClick={() => setReviewRating(r)}>
                        <FiStar size={24}
                          className={r <= reviewRating ? 'text-brand-500 fill-brand-500' : 'text-gray-200'} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience with this tee…"
                  rows={4}
                  className="form-input resize-none"
                  required
                />
                <button type="submit" className="btn-primary w-full" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-ink/50 mb-4">You need to be logged in to leave a review.</p>
                <Link to="/login" className="btn-primary">Log In</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;
