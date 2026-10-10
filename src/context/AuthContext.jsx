import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { clientStore } from '../api/clientStore';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  // Load user on mount if token exists
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('sweetcrumbs_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res && res.data && res.data.success) {
            setUser(res.data.user);
          } else {
            const localUser = clientStore.getCurrentUser();
            setUser(localUser);
          }
        } catch (err) {
          const localUser = clientStore.getCurrentUser();
          if (localUser) {
            setUser(localUser);
          } else {
            localStorage.removeItem('sweetcrumbs_token');
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res && res.data && res.data.success) {
        setUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('sweetcrumbs_token', res.data.token);
        }
        showToast(`Welcome back, ${res.data.user.name}! 🍰`, 'success');
        return { success: true };
      }
      throw new Error(res?.data?.message || 'Login failed');
    } catch (err) {
      try {
        const { user: logUser, token } = clientStore.login(email, password);
        setUser(logUser);
        if (token) localStorage.setItem('sweetcrumbs_token', token);
        showToast(`Welcome back, ${logUser.name}! 🍰`, 'success');
        return { success: true };
      } catch (clientErr) {
        showToast(clientErr.message, 'error');
        return { success: false, message: clientErr.message };
      }
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (res && res.data && res.data.success) {
        setUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('sweetcrumbs_token', res.data.token);
        }
        showToast('Welcome to Bhuvneshwari Cakes! 🍰', 'success');
        return { success: true };
      }
      throw new Error(res?.data?.message || 'Registration failed');
    } catch (err) {
      try {
        const { user: regUser, token } = clientStore.register(userData);
        setUser(regUser);
        if (token) localStorage.setItem('sweetcrumbs_token', token);
        showToast('Welcome to Bhuvneshwari Cakes! 🍰', 'success');
        return { success: true };
      } catch (clientErr) {
        showToast(clientErr.message, 'error');
        return { success: false, message: clientErr.message };
      }
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout server call:', err.message);
    } finally {
      localStorage.removeItem('sweetcrumbs_token');
      setUser(null);
      showToast('You have been logged out.', 'info');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.data.success) {
        setUser(res.data.user);
        showToast('Profile updated successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message, 'error');
      return { success: false, message: err.message };
    }
  };

  const toggleWishlist = async (cakeId) => {
    if (!user) {
      showToast('Please log in to save items to your wishlist.', 'info');
      return false;
    }

    try {
      const res = await api.post(`/auth/wishlist/${cakeId}`);
      if (res.data.success) {
        setUser((prev) => ({
          ...prev,
          wishlist: res.data.wishlist
        }));
        showToast(res.data.message, 'success');
        return res.data.action === 'added';
      }
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const isInWishlist = (cakeId) => {
    if (!user || !user.wishlist) return false;
    return user.wishlist.some(
      (item) => (typeof item === 'string' ? item : item._id) === cakeId
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
