/**
 * components/ProductCard.jsx
 *
 * Displays a product thumbnail card in the catalogue.
 * Shows: image, name, tagline, rating, price, colour dots.
 * Clicking navigates to the product detail page.
 */

import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Determine which price to show (sale vs regular)
  const displayPrice = product.salePrice ?? product.price;
  const isOnSale     = !!product.salePrice;

  const handleQuickAdd = (e) => {
    e.preventDefault(); // Don't navigate to detail page
    addToCart({
      _id:   product._id,
      name:  product.name,
      image: product.images?.[0] || '',
      price: displayPrice,
      slug:  product.slug,
    });
  };

  return (
    <Link
      to={`/products/${product.slug || product._id}`}
      className="group block card hover:translate-y-[-4px] transition-transform duration-300"
    >
      {/* ── Product Image ─────────────────────────────── */}
      <div className="relative overflow-hidden bg-cream-dark" style={{ aspectRatio: '3/4' }}>
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          /* Placeholder when no image is available */
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-100 to-cream-dark">
            <span className="text-5xl mb-3">👕</span>
            <span className="text-xs text-ink/30 font-accent">No image yet</span>
          </div>
        )}

        {/* Sale badge */}
        {isOnSale && (
          <span className="absolute top-3 left-3 tag-orange">Sale</span>
        )}

        {/* Custom design badge */}
        {product.allowCustomDesign && (
          <span className="absolute top-3 right-3 tag-dark">Customisable</span>
        )}

        {/* Quick-add button (appears on hover) */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100
                     bg-white rounded-full p-2.5 shadow-md
                     hover:bg-brand-500 hover:text-white
                     transition-all duration-300"
          aria-label={`Add ${product.name} to cart`}
        >
          <FiShoppingCart size={18} />
        </button>
      </div>

      {/* ── Card Body ─────────────────────────────────── */}
      <div className="p-4">
        {/* Category tag */}
        <span className="text-xs font-accent text-brand-500 uppercase tracking-wide">
          {product.category?.replace('-', ' ')}
        </span>

        {/* Name */}
        <h3 className="mt-1 text-base font-semibold text-ink leading-snug line-clamp-1">
          {product.name}
        </h3>

        {/* Tagline */}
        {product.tagline && (
          <p className="text-xs text-ink/50 mt-0.5 line-clamp-1 italic">
            "{product.tagline}"
          </p>
        )}

        {/* Rating */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <FiStar size={13} className="text-brand-500 fill-brand-500" />
            <span className="text-xs font-medium text-ink/70">
              {product.rating.toFixed(1)} ({product.numReviews})
            </span>
          </div>
        )}

        {/* Price row */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-lg font-bold text-ink">
            {formatCurrency(displayPrice)}
          </span>
          {isOnSale && (
            <span className="text-sm line-through text-ink/30">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>

        {/* Colour options preview */}
        {product.colors?.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3">
            {product.colors.slice(0, 5).map((c, i) => (
              <span
                key={i}
                title={c.name}
                className="w-4 h-4 rounded-full border border-gray-200 cursor-pointer"
                style={{ backgroundColor: c.hexCode || '#ccc' }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-xs text-ink/40">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
