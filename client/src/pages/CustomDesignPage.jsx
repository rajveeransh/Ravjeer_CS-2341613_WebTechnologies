/**
 * pages/CustomDesignPage.jsx
 *
 * Interactive t-shirt design editor.
 * Features:
 * - Base product selector
 * - Text layer: content, font, color, size
 * - Image upload layer
 * - Print position selector
 * - Live preview (CSS-based simulation)
 * - Save design / Add to Cart
 *
 * Note: For production, integrate Fabric.js for full canvas editing.
 * This implementation provides a clean, functional foundation.
 */

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiUpload, FiType, FiDownload, FiShoppingCart, FiSave } from 'react-icons/fi';
import { designService }  from '../services/designService';
import { productService } from '../services/productService';
import { useAuth }        from '../context/AuthContext';
import { useCart }        from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

const FONTS = ['Arial', 'Georgia', 'Courier New', 'Impact', 'Trebuchet MS', 'Verdana'];
const POSITIONS = ['front', 'back', 'left-sleeve', 'right-sleeve'];

const CustomDesignPage = () => {
  const [searchParams]     = useSearchParams();
  const navigate           = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart }       = useCart();

  const [products, setProducts]   = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'image'
  const [saving, setSaving]       = useState(false);

  // Text layer state
  const [text, setText]           = useState('');
  const [font, setFont]           = useState('Arial');
  const [fontSize, setFontSize]   = useState(24);
  const [textColor, setTextColor] = useState('#1a1a2e');
  const [bold, setBold]           = useState(false);
  const [italic, setItalic]       = useState(false);

  // Image layer state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl]           = useState('');
  const [uploading, setUploading]         = useState(false);

  // Print position
  const [printPosition, setPrintPosition] = useState('front');

  const fileInputRef = useRef();

  // Load products
  useEffect(() => {
    productService.getAll({ limit: 50 })
      .then((res) => {
        const customisable = (res.data || []).filter((p) => p.allowCustomDesign);
        setProducts(customisable);

        // Pre-select product from URL query param
        const preselect = searchParams.get('product');
        if (preselect) {
          const found = customisable.find((p) => p._id === preselect);
          if (found) setSelectedProduct(found);
        } else if (customisable.length > 0) {
          setSelectedProduct(customisable[0]);
        }
      })
      .catch(console.error);
  }, [searchParams]);

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setUploadedImage(localUrl);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await designService.uploadImage(formData);
      setImageUrl(res.data.url);
      toast.success('Image uploaded!');
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Save design to dashboard
  const handleSaveDesign = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save your design.');
      navigate('/login');
      return;
    }
    if (!selectedProduct) {
      toast.error('Please select a product.');
      return;
    }

    setSaving(true);
    try {
      await designService.create({
        product:       selectedProduct._id,
        title:         text ? `"${text.slice(0, 20)}…"` : 'My Custom Design',
        textLayer:     { content: text, font, fontSize, color: textColor, bold, italic },
        imageLayer:    { url: imageUrl },
        printPosition,
      });
      toast.success('Design saved to your dashboard! ✨');
    } catch {
      toast.error('Could not save design.');
    } finally {
      setSaving(false);
    }
  };

  // Add to cart with design
  const handleAddToCart = () => {
    if (!selectedProduct) { toast.error('Select a product first.'); return; }
    addToCart({
      _id:   selectedProduct._id,
      name:  `${selectedProduct.name} (Custom)`,
      image: selectedProduct.images?.[0] || '',
      price: selectedProduct.salePrice ?? selectedProduct.price,
    });
    navigate('/cart');
  };

  const displayPrice = selectedProduct
    ? formatCurrency(selectedProduct.salePrice ?? selectedProduct.price)
    : null;

  return (
    <div className="section-wrapper">
      <div className="mb-10">
        <span className="tag-orange mb-3 inline-block">The Studio</span>
        <h1 className="font-display font-bold text-ink">
          Design Your <span className="gradient-text">Perfect Tee</span>
        </h1>
        <p className="text-ink/60 mt-2 max-w-lg">
          This is your canvas. No rules, no templates — just your ideas on premium fabric.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ── LEFT: T-Shirt Preview ────────────────────── */}
        <div className="sticky top-24">
          {/* Product selector */}
          <div className="mb-5">
            <label className="text-xs font-accent font-semibold text-ink/50 uppercase tracking-wide block mb-2">
              Choose Base Product
            </label>
            <select
              value={selectedProduct?._id || ''}
              onChange={(e) => {
                const found = products.find((p) => p._id === e.target.value);
                setSelectedProduct(found || null);
              }}
              className="form-input"
            >
              <option value="">— Select a product —</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} – {formatCurrency(p.salePrice ?? p.price)}
                </option>
              ))}
            </select>
          </div>

          {/* Live preview */}
          <div className="relative rounded-3xl overflow-hidden bg-cream-dark border-2 border-dashed border-brand-200"
               style={{ aspectRatio: '3/4' }}>

            {/* Base product image */}
            {selectedProduct?.images?.[0] ? (
              <img
                src={selectedProduct.images[0]}
                alt="T-shirt base"
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl opacity-20">👕</span>
              </div>
            )}

            {/* Design overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-40 h-40 flex flex-col items-center justify-center gap-2">

                {/* User's uploaded image */}
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Design"
                    className="max-w-full max-h-24 object-contain rounded-lg shadow-md"
                  />
                )}

                {/* User's text */}
                {text && (
                  <p
                    style={{
                      fontFamily:  font,
                      fontSize:    `${Math.max(10, fontSize / 3)}px`,
                      color:       textColor,
                      fontWeight:  bold ? 'bold' : 'normal',
                      fontStyle:   italic ? 'italic' : 'normal',
                      textShadow:  '0 1px 3px rgba(255,255,255,0.6)',
                      textAlign:   'center',
                      wordBreak:   'break-word',
                    }}
                  >
                    {text}
                  </p>
                )}

                {/* Empty prompt */}
                {!text && !uploadedImage && (
                  <p className="text-xs text-ink/20 text-center italic">
                    Your design appears here
                  </p>
                )}
              </div>
            </div>

            {/* Print position label */}
            <div className="absolute bottom-3 left-3">
              <span className="tag-dark text-xs capitalize">{printPosition}</span>
            </div>
          </div>

          {/* Price + actions */}
          {selectedProduct && (
            <div className="mt-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-ink/40">Total Price</p>
                <p className="text-2xl font-bold text-brand-600">{displayPrice}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveDesign} disabled={saving} className="btn-secondary py-2 px-4 text-sm">
                  <FiSave size={15} /> {saving ? 'Saving…' : 'Save'}
                </button>
                <button onClick={handleAddToCart} className="btn-primary py-2 px-4 text-sm">
                  <FiShoppingCart size={15} /> Add to Cart
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Design Controls ───────────────────── */}
        <div className="space-y-6">

          {/* Tab selector */}
          <div className="flex gap-2 bg-cream-dark rounded-2xl p-1">
            {[
              { id: 'text',  label: 'Add Text',  icon: <FiType size={16} /> },
              { id: 'image', label: 'Add Image', icon: <FiUpload size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all
                            ${activeTab === tab.id ? 'bg-white text-ink shadow-sm' : 'text-ink/50 hover:text-ink'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* TEXT CONTROLS */}
          {activeTab === 'text' && (
            <div className="card p-6 space-y-5">
              <div>
                <label className="text-xs font-accent text-ink/50 uppercase tracking-wide block mb-2">Your Text</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type something meaningful…"
                  rows={3}
                  className="form-input resize-none"
                  maxLength={100}
                />
                <p className="text-xs text-ink/30 mt-1 text-right">{text.length}/100</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-accent text-ink/50 uppercase tracking-wide block mb-2">Font</label>
                  <select value={font} onChange={(e) => setFont(e.target.value)} className="form-input text-sm">
                    {FONTS.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-accent text-ink/50 uppercase tracking-wide block mb-2">Size ({fontSize}px)</label>
                  <input
                    type="range" min="12" max="72" value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-brand-500 mt-3"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <label className="text-xs font-accent text-ink/50 uppercase tracking-wide block mb-2">Colour</label>
                  <input
                    type="color" value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer"
                  />
                </div>
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setBold(!bold)}
                    className={`w-10 h-10 rounded-xl font-bold text-base border-2 transition-all
                                ${bold ? 'bg-ink text-white border-ink' : 'border-gray-200 text-ink'}`}
                  >B</button>
                  <button
                    onClick={() => setItalic(!italic)}
                    className={`w-10 h-10 rounded-xl italic text-base border-2 transition-all
                                ${italic ? 'bg-ink text-white border-ink' : 'border-gray-200 text-ink'}`}
                  >I</button>
                </div>
              </div>
            </div>
          )}

          {/* IMAGE CONTROLS */}
          {activeTab === 'image' && (
            <div className="card p-6 space-y-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-brand-200 rounded-2xl p-10
                           text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50
                           transition-all group"
              >
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-ink/50">Uploading…</p>
                  </div>
                ) : uploadedImage ? (
                  <div className="flex flex-col items-center gap-3">
                    <img src={uploadedImage} alt="Uploaded" className="max-h-32 object-contain rounded-lg" />
                    <p className="text-xs text-ink/40">Click to change image</p>
                  </div>
                ) : (
                  <>
                    <FiUpload size={32} className="mx-auto text-brand-400 mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-sm font-semibold text-ink">Click to upload your art</p>
                    <p className="text-xs text-ink/40 mt-1">PNG, JPG, GIF — max 5 MB</p>
                  </>
                )}
              </div>

              {uploadedImage && (
                <button
                  onClick={() => { setUploadedImage(null); setImageUrl(''); }}
                  className="text-sm text-red-400 hover:text-red-500 transition-colors"
                >
                  Remove image
                </button>
              )}
            </div>
          )}

          {/* PRINT POSITION */}
          <div className="card p-6">
            <label className="text-xs font-accent text-ink/50 uppercase tracking-wide block mb-3">Print Position</label>
            <div className="grid grid-cols-2 gap-2">
              {POSITIONS.map((pos) => (
                <button
                  key={pos}
                  onClick={() => setPrintPosition(pos)}
                  className={`py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all capitalize
                              ${printPosition === pos
                                ? 'bg-ink text-white border-ink'
                                : 'border-gray-200 text-ink/60 hover:border-brand-300'
                              }`}
                >
                  {pos.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-brand-50 rounded-2xl p-5">
            <p className="text-xs font-semibold text-brand-700 mb-2">💡 Design Tips</p>
            <ul className="text-xs text-brand-600 space-y-1">
              <li>• Use transparent PNG images for the cleanest result</li>
              <li>• High contrast text reads better on coloured shirts</li>
              <li>• Keep designs within 25×25 cm for best print quality</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDesignPage;
