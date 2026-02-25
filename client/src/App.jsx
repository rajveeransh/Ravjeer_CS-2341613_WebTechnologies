/**
 * App.jsx – Rupkala Routing Configuration
 *
 * Defines all application routes.
 * Protected routes redirect unauthenticated users to /login.
 * Admin routes additionally require the 'admin' role.
 */

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect }    from 'react';
import Navbar           from './components/Navbar';
import Footer           from './components/Footer';
import CartDrawer       from './components/CartDrawer';
import { useAuth }      from './context/AuthContext';

// Public pages
import HomePage           from './pages/HomePage';
import ProductsPage       from './pages/ProductsPage';
import ProductDetailPage  from './pages/ProductDetailPage';
import CustomDesignPage   from './pages/CustomDesignPage';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import OrderConfirmPage   from './pages/OrderConfirmPage';

// Protected user pages
import CheckoutPage   from './pages/CheckoutPage';
import DashboardPage  from './pages/DashboardPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts  from './pages/admin/AdminProducts';
import AdminOrders    from './pages/admin/AdminOrders';

// ── Route guard: requires login ──────────────────────────
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated
    ? children
    : <Navigate to="/login" state={{ from: location }} replace />;
};

// ── Route guard: requires admin role ────────────────────
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin)         return <Navigate to="/"      replace />;
  return children;
};

// ── Scroll to top on navigation ──────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
};

// ── Pages that don't use the standard Navbar/Footer ──────
const FULL_SCREEN_ROUTES = ['/login', '/register'];

const App = () => {
  const { pathname } = useLocation();
  const isFullScreen = FULL_SCREEN_ROUTES.includes(pathname);

  return (
    <>
      <ScrollToTop />
      {!isFullScreen && <Navbar />}
      <CartDrawer />

      <Routes>
        {/* ── Public routes ─────────────────────────── */}
        <Route path="/"           element={<HomePage />} />
        <Route path="/products"   element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/design"     element={<CustomDesignPage />} />
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/register"   element={<RegisterPage />} />

        {/* ── Protected user routes ──────────────────── */}
        <Route path="/checkout"   element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
        <Route path="/dashboard"  element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/order-confirm/:id" element={<PrivateRoute><OrderConfirmPage /></PrivateRoute>} />

        {/* ── Admin routes ───────────────────────────── */}
        <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders"   element={<AdminRoute><AdminOrders /></AdminRoute>} />

        {/* ── 404 fallback ───────────────────────────── */}
        <Route path="*" element={
          <div className="section-wrapper text-center py-32">
            <p className="text-7xl mb-6">👕</p>
            <h1 className="font-display font-bold text-ink mb-4">Page Not Found</h1>
            <p className="text-ink/50 mb-8">Looks like this tee doesn't exist (yet).</p>
            <a href="/" className="btn-primary">Go Home</a>
          </div>
        } />
      </Routes>

      {!isFullScreen && <Footer />}
    </>
  );
};

export default App;
