import { createContext, useContext, useState, useEffect } from 'react';
import { currentUser } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Simulate loading from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('findit_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, remember = false) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    const loggedUser = { ...currentUser, email };
    setUser(loggedUser);
    if (remember) localStorage.setItem('findit_user', JSON.stringify(loggedUser));
    return loggedUser;
  };

  const signup = async (data) => {
    await new Promise((r) => setTimeout(r, 1500));
    const newUser = { ...currentUser, ...data, id: `u_${Date.now()}` };
    setUser(newUser);
    localStorage.setItem('findit_user', JSON.stringify(newUser));
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('findit_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
