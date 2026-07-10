/* eslint-disable react/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('findit_token') || sessionStorage.getItem('findit_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const remember = localStorage.getItem('findit_remember') === 'true';
      const localToken = localStorage.getItem('findit_token');
      const sessionToken = sessionStorage.getItem('findit_token');
      const token = localToken || sessionToken;

      if (localToken && !remember) {
        localStorage.removeItem('findit_token');
        localStorage.removeItem('findit_remember');
      }

      if (token) {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.data);
          } else {
            localStorage.removeItem('findit_token');
            sessionStorage.removeItem('findit_token');
            localStorage.removeItem('findit_remember');
          }
        } catch (err) {
          localStorage.removeItem('findit_token');
          sessionStorage.removeItem('findit_token');
          localStorage.removeItem('findit_remember');
          console.error('Auth check failed:', err.message);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password, remember = false) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, data } = response.data;
        if (remember) {
          localStorage.setItem('findit_token', token);
          localStorage.setItem('findit_remember', 'true');
        } else {
          sessionStorage.setItem('findit_token', token);
          localStorage.removeItem('findit_remember');
          localStorage.removeItem('findit_token');
        }
        setUser(data);
        setLoading(false);
        return data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const signup = async (data) => {
    try {
      setError(null);
      const response = await api.post('/auth/signup', data);
      
      if (response.data.success) {
        const { token, data: user } = response.data;
        sessionStorage.setItem('findit_token', token);
        localStorage.removeItem('findit_token');
        localStorage.removeItem('findit_remember');
        setUser(user);
        setLoading(false);
        return user;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Signup failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    setUser(null);
    setLoading(false);
    localStorage.removeItem('findit_token');
    localStorage.removeItem('findit_remember');
    sessionStorage.removeItem('findit_token');
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await api.put('/users/profile', profileData);
      
      if (response.data.success) {
        setUser(response.data.data);
        return response.data.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Update failed';
      setError(message);
      throw new Error(message);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      signup, 
      logout,
      updateProfile,
      isAdmin,
      api,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
