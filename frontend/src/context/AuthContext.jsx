import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('salary_crm_token') || null);
  const [loading, setLoading] = useState(true);
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
    try {
      if (token) {
        const res = await api.getMe();
        if (res.success) {
          setUser(res.user);
        } else {
          logout();
        }
      }
    } catch {
      logout();
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

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      localStorage.setItem('salary_crm_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success) {
      localStorage.setItem('salary_crm_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('salary_crm_token');
    setToken(null);
    setUser(null);
  };

  const updateUserProfile = async (data) => {
    const res = await api.updateProfile(data);
    if (res.success) {
      setUser(prev => ({ ...prev, ...res.user }));
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
