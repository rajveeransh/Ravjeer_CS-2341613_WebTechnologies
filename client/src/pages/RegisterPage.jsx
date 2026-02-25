/**
 * pages/RegisterPage.jsx
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) navigate('/');
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card p-8 md:p-10">

          <div className="text-center mb-8">
            <Link to="/" className="text-2xl font-display font-bold text-ink hover:text-brand-500 transition-colors">
              Rupkala
            </Link>
            <h1 className="text-2xl font-display font-bold text-ink mt-4 mb-1">
              Start your creative journey
            </h1>
            <p className="text-sm text-ink/50">
              Join thousands of people designing tees that mean something.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="form-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Create Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="form-input"
                required
                minLength={6}
              />
            </div>

            <p className="text-xs text-ink/40">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-brand-500">Terms of Use</Link> and{' '}
              <Link to="/privacy" className="text-brand-500">Privacy Policy</Link>.
            </p>

            <button type="submit" className="btn-primary w-full py-3.5" disabled={loading}>
              {loading ? 'Creating account…' : 'Join Rupkala ✨'}
            </button>
          </form>

          <p className="text-center text-sm text-ink/50 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-medium hover:text-brand-600">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
