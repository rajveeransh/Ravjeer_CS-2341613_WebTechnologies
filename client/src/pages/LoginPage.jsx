/**
 * pages/LoginPage.jsx
 * Warm, humanistic login experience.
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login }      = useAuth();
  const navigate       = useNavigate();
  const location       = useLocation();
  const from           = location.state?.from?.pathname || '/';

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(result.role === 'admin' ? '/admin' : from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="card p-8 md:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-display font-bold text-ink hover:text-brand-500 transition-colors">
              Rupkala
            </Link>
            <h1 className="text-2xl font-display font-bold text-ink mt-4 mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-ink/50">
              Your creativity missed you. Let's pick up where you left off.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-ink">Password</label>
                <a href="#" className="text-xs text-brand-500 hover:text-brand-600">Forgot password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
              {loading ? 'Logging in…' : 'Log In to Rupkala'}
            </button>
          </form>

          <p className="text-center text-sm text-ink/50 mt-6">
            New here?{' '}
            <Link to="/register" className="text-brand-500 font-medium hover:text-brand-600">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
