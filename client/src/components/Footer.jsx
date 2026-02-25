/**
 * components/Footer.jsx
 *
 * Brand-rich footer with:
 * - Mission statement
 * - Navigation columns
 * - Social links
 * - Legal row
 */

import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/80">
      {/* ── Main footer content ──────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-display font-bold text-white mb-3">
              Rupkala
            </h3>
            <p className="text-sm font-accent text-brand-400 mb-4">रूपकला — Art of Form</p>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              We believe your wardrobe should speak for you. Rupkala was born
              to give creativity a canvas, and personal expression a home.
              Every tee you design is a story the world gets to read.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" aria-label="Instagram" className="text-white/40 hover:text-brand-400 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="text-white/40 hover:text-brand-400 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-white/40 hover:text-brand-400 transition-colors">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h4 className="text-sm font-accent font-semibold text-white uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'All T-Shirts',    to: '/products' },
                { label: 'Graphic Tees',    to: '/products?category=graphic-tee' },
                { label: 'Oversized Fits',  to: '/products?category=oversized' },
                { label: 'Custom Design',   to: '/design' },
                { label: 'New Arrivals',    to: '/products?sort=newest' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/50 hover:text-brand-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h4 className="text-sm font-accent font-semibold text-white uppercase tracking-wider mb-4">
              Help & Info
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Our Story',     to: '/#story' },
                { label: 'Size Guide',    to: '/size-guide' },
                { label: 'Returns',       to: '/returns' },
                { label: 'Shipping',      to: '/shipping' },
                { label: 'Contact Us',    to: '/contact' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/50 hover:text-brand-400 transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Legal row ────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {year} Rupkala. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/30">
            <Link to="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="hover:text-white/60 transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
