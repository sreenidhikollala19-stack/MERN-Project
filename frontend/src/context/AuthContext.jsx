import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('eventease_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [vendorProfile, setVendorProfile] = useState(() => {
    try {
      const savedVendor = localStorage.getItem('eventease_vendor');
      return savedVendor ? JSON.parse(savedVendor) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('eventease_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('eventease_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.success) {
            setUser(res.user);
            setVendorProfile(res.vendorProfile);
            localStorage.setItem('eventease_user', JSON.stringify(res.user));
            if (res.vendorProfile) {
              localStorage.setItem('eventease_vendor', JSON.stringify(res.vendorProfile));
            }
          }
        } catch (error) {
          console.warn('Session verification failed, clearing auth:', error.message);
          logout(false);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        localStorage.setItem('eventease_token', res.token);
        localStorage.setItem('eventease_user', JSON.stringify(res.user));
        if (res.vendorProfile) {
          localStorage.setItem('eventease_vendor', JSON.stringify(res.vendorProfile));
        }

        setToken(res.token);
        setUser(res.user);
        setVendorProfile(res.vendorProfile);
        toast.success(`Welcome back, ${res.user.name}!`);
        return { success: true, user: res.user };
      }
    } catch (error) {
      toast.error(error.message || 'Login failed');
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res.success) {
        localStorage.setItem('eventease_token', res.token);
        localStorage.setItem('eventease_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);

        // Fetch refreshed user info to get complete vendor profile if vendor
        if (res.user.role === 'vendor') {
          try {
            const meRes = await api.get('/auth/me');
            if (meRes.vendorProfile) {
              setVendorProfile(meRes.vendorProfile);
              localStorage.setItem('eventease_vendor', JSON.stringify(meRes.vendorProfile));
            }
          } catch (e) {
            console.error('Failed to load initial vendor profile', e);
          }
        }

        toast.success(res.message || 'Registration successful!');
        return { success: true, user: res.user };
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed');
      return { success: false, error: error.message };
    }
  };

  const logout = (showToast = true) => {
    localStorage.removeItem('eventease_token');
    localStorage.removeItem('eventease_user');
    localStorage.removeItem('eventease_vendor');
    setToken(null);
    setUser(null);
    setVendorProfile(null);
    if (showToast) {
      toast.success('Logged out successfully');
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success) {
        setUser(res.user);
        setVendorProfile(res.vendorProfile);
        localStorage.setItem('eventease_user', JSON.stringify(res.user));
        if (res.vendorProfile) {
          localStorage.setItem('eventease_vendor', JSON.stringify(res.vendorProfile));
        }
      }
    } catch (error) {
      console.error('Failed to refresh user', error);
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await api.put('/auth/profile', data);
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('eventease_user', JSON.stringify(res.user));
        toast.success('Profile updated successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    vendorProfile,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isCustomer: user?.role === 'customer',
    isVendor: user?.role === 'vendor',
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

