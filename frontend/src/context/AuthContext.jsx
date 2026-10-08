import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('salary_crm_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('salary_crm_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  // Only show initial blocking loader if token exists but cached user is missing
  const [loading, setLoading] = useState(() => {
    const savedToken = localStorage.getItem('salary_crm_token');
    const savedUser = localStorage.getItem('salary_crm_user');
    return !savedUser && !!savedToken;
  });
  const [dbStatus, setDbStatus] = useState({ connected: false, readyState: 0 });

  const checkDbStatus = async () => {
    try {
      const res = await api.getStatus();
      if (res.success && res.db) {
        setDbStatus(res.db);
      }
    } catch {
      // Backend may be starting up
    }
  };

  const loadUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await api.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('salary_crm_user', JSON.stringify(res.user));
      } else if (res.status === 401) {
        logout();
      }
    } catch (err) {
      // ONLY logout if server explicitly rejected the token with HTTP 401 Unauthorized
      if (err?.status === 401) {
        console.warn('Session expired or invalid, logging out.');
        logout();
      } else {
        // Backend temporarily compiling, proxy reconnecting, or offline:
        // Do NOT log out! Keep the cached user session intact.
        console.warn('Backend is temporarily unreachable; retaining cached user session:', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    checkDbStatus();
    const interval = setInterval(checkDbStatus, 15000);
    return () => clearInterval(interval);
  }, [token]);

  const [loginNotification, setLoginNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const dismissNotification = () => {
    setLoginNotification(null);
  };

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      localStorage.setItem('salary_crm_token', res.token);
      localStorage.setItem('salary_crm_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);

      const notif = {
        id: Date.now(),
        title: 'Login Successful',
        message: `Welcome back, ${res.user?.name || 'User'}!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'success'
      };
      setLoginNotification(notif);
      setNotifications(prev => [notif, ...prev]);

      // Auto-dismiss floating toast after 5s
      setTimeout(() => {
        setLoginNotification(prev => (prev?.id === notif.id ? null : prev));
      }, 5000);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success) {
      localStorage.setItem('salary_crm_token', res.token);
      localStorage.setItem('salary_crm_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);

      const notif = {
        id: Date.now(),
        title: 'Account Created',
        message: `Welcome, ${res.user?.name || 'User'}! Your profile is ready.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'success'
      };
      setLoginNotification(notif);
      setNotifications(prev => [notif, ...prev]);

      setTimeout(() => {
        setLoginNotification(prev => (prev?.id === notif.id ? null : prev));
      }, 5000);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('salary_crm_token');
    localStorage.removeItem('salary_crm_user');
    setToken(null);
    setUser(null);
    setLoginNotification(null);
  };

  const updateUserProfile = async (data) => {
    const res = await api.updateProfile(data);
    if (res.success) {
      setUser(prev => {
        const updated = { ...prev, ...res.user };
        localStorage.setItem('salary_crm_user', JSON.stringify(updated));
        return updated;
      });
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        dbStatus,
        loginNotification,
        notifications,
        dismissNotification,
        login,
        register,
        logout,
        updateUserProfile,
        checkDbStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
