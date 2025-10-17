import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import api, { authAPI } from '../utils/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const resp = await authAPI.login(email, password);
      const t = resp.data?.token || resp.token;
      const u = resp.data?.user || resp.user;
      setToken(t);
      setUser(u);
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email, password, name) => {
    setLoading(true);
    try {
      const resp = await authAPI.register(email, password, name);
      const t = resp.data?.token || resp.token;
      const u = resp.data?.user || resp.user;
      setToken(t);
      setUser(u);
      localStorage.setItem('token', t);
      localStorage.setItem('user', JSON.stringify(u));
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const resp = await api.get('/auth/me');
      const u = resp.data || resp;
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
    } catch {}
  }, [token]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const value = useMemo(() => ({ token, user, loading, login, register, logout, refreshProfile }), [token, user, loading, login, register, logout, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


