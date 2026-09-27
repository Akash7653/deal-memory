import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchMe, loginUser, registerUser, logoutUser, updateUserProfile } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('dealmemory_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('dealmemory_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetchMe();
        if (res && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
          localStorage.removeItem('dealmemory_token');
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        setUser(null);
        localStorage.removeItem('dealmemory_token');
      } finally {
        setLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.token && res.user) {
      localStorage.setItem('dealmemory_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error('Authentication failed: Missing token or user.');
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    if (res.token && res.user) {
      localStorage.setItem('dealmemory_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    }
    throw new Error('Registration failed: Missing token or user.');
  };

  const demoLogin = async () => {
    return login('demo@dealmemory.ai', 'demopassword123');
  };

  const updateProfile = async (profileData) => {
    const res = await updateUserProfile(profileData);
    if (res && res.user) {
      setUser(res.user);
      return res.user;
    }
    throw new Error('Failed to update profile');
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error('Error during logout:', e);
    } finally {
      localStorage.removeItem('dealmemory_token');
      setToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        demoLogin,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
