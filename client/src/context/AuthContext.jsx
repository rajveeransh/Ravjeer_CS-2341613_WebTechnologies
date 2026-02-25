/**
 * context/AuthContext.jsx
 *
 * Provides authentication state (user, token) and actions
 * (login, register, logout, updateUser) to the entire app
 * via React Context API.
 *
 * User data is persisted in localStorage so sessions survive
 * browser refresh.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// ── Create the context ──────────────────────────────────
const AuthContext = createContext(null);

// ── Custom hook for convenient consumption ──────────────
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// ── Provider component ──────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on first mount
  useEffect(() => {
    const savedUser  = localStorage.getItem('rupkala_user');
    const savedToken = localStorage.getItem('rupkala_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      // Attach token globally for all Axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  // ── Helpers ─────────────────────────────────────────────
  const persistSession = (userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem('rupkala_user', JSON.stringify(userData));
    localStorage.setItem('rupkala_token', tokenStr);
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenStr}`;
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('rupkala_user');
    localStorage.removeItem('rupkala_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  // ── Auth actions ─────────────────────────────────────────
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/register', { name, email, password });
      persistSession(data.data, data.data.token);
      toast.success(data.message);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      persistSession(data.data, data.data.token);
      toast.success(data.message);
      return { success: true, role: data.data.role };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed.';
      toast.error(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
    toast.success('Logged out. See you soon! 👋');
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem('rupkala_user', JSON.stringify(merged));
  };

  // ── Context value ─────────────────────────────────────────
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isAdmin:         user?.role === 'admin',
    register,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
