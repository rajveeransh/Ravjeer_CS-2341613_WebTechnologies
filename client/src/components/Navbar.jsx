/**
 * components/Navbar.jsx
 *
 * Responsive top navigation bar with:
 * - Brand logo + tagline
 * - Navigation links
 * - Cart icon with badge
 * - Auth-aware login/logout
 * - Mobile hamburger menu
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount, setIsCartOpen }               = useCart();
  const navigate    = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const navLinks = [
    { label: 'Shop',    to: '/products' },
    { label: 'Design',  to: '/design' },
    { label: 'Story',   to: '/#story' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-cream-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ───────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-display font-bold text-ink group-hover:text-brand-500 transition-colors">
              Rupkala
            </span>
            <span className="hidden sm:block text-xs font-accent text-ink/50 ml-1 mt-1">
              रूपकला
            </span>
          </Link>

          {/* ── Desktop nav links ───────────────────────── */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-ink/70 hover:text-brand-500 font-body font-medium text-sm transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Right-side actions ──────────────────────── */}
          <div className="flex items-center gap-3">

            {/* Cart icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-brand-50 transition-colors"
              aria-label="Open cart"
            >
              <FiShoppingCart className="text-ink" size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center
                                 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Auth actions */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-full hover:bg-brand-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-ink">{user.name}</p>
                      <p className="text-xs text-ink/50">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-ink hover:bg-brand-50 transition-colors"
                    >
                      <FiUser size={16} /> My Dashboard
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-brand-600 font-medium hover:bg-brand-50 transition-colors"
                      >
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-5">
                Log In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-brand-50 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile nav menu ─────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-cream-dark bg-white px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-ink/70 hover:text-brand-500 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
