import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchMe, loginUser, registerUser, logoutUser, updateUserProfile } from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('dealmemory_token'));
  
  const [adminUser, setAdminUser] = useState(null);
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('dealmemory_admin_token'));
  
  const [loading, setLoading] = useState(true);

  // Initialize both company user session and admin session
  useEffect(() => {
    async function initAuth() {
      const storedToken = localStorage.getItem('dealmemory_token');
      const storedAdminToken = localStorage.getItem('dealmemory_admin_token');

      // Initialize Company User
      if (storedToken) {
        try {
          const res = await fetchMe();
          if (res && res.user) {
            setUser(res.user);
            setCompany(res.company || null);
          } else {
            setUser(null);
            setCompany(null);
            localStorage.removeItem('dealmemory_token');
          }
        } catch (err) {
          console.error('Session initialization error:', err);
          setUser(null);
          setCompany(null);
          localStorage.removeItem('dealmemory_token');
        }
      }

      // Initialize Admin
      if (storedAdminToken) {
        try {
          const res = await adminFetchMe();
          if (res && res.user && res.user.role === 'admin') {
            setAdminUser(res.user);
          } else {
            setAdminUser(null);
            localStorage.removeItem('dealmemory_admin_token');
          }
        } catch (err) {
          console.error('Admin session initialization error:', err);
          setAdminUser(null);
          localStorage.removeItem('dealmemory_admin_token');
        }
      }

      setLoading(false);
    }
    initAuth();
  }, []);

  // Company User Login
  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.token && res.user) {
      localStorage.setItem('dealmemory_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setCompany(res.company || null);
      return { user: res.user, company: res.company, status: res.status };
    }
    throw new Error('Authentication failed: Missing token or user.');
  };

  // Company Registration
  const register = async (registrationData) => {
    const res = await registerUser(registrationData);
    if (res.token && res.user) {
      localStorage.setItem('dealmemory_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setCompany(res.company || null);
      return { user: res.user, company: res.company, status: res.status || 'pending' };
    }
    throw new Error('Registration failed: Missing token or user.');
  };

  // Refresh current user and company state
  const refreshSession = async () => {
    try {
      const res = await fetchMe();
      if (res && res.user) {
        setUser(res.user);
        setCompany(res.company || null);
        return { user: res.user, company: res.company };
      }
    } catch (e) {
      console.error('Error refreshing session:', e);
    }
    return null;
  };

  // Demo Login (TechNova Solutions)
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

  // Company User Logout
  const logout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error('Error during logout:', e);
    } finally {
      localStorage.removeItem('dealmemory_token');
      setToken(null);
      setUser(null);
      setCompany(null);
    }
  };

  // Admin Login
  const adminLogin = async (email, password) => {
    const res = await adminLoginUser({ email, password });
    if (res.token && res.user && res.user.role === 'admin') {
      localStorage.setItem('dealmemory_admin_token', res.token);
      setAdminToken(res.token);
      setAdminUser(res.user);
      return res.user;
    }
    throw new Error('Admin authentication failed.');
  };

  // Admin Logout
  const adminLogout = async () => {
    try {
      await adminLogoutUser();
    } catch (e) {
      console.error('Error during admin logout:', e);
    } finally {
      localStorage.removeItem('dealmemory_admin_token');
      setAdminToken(null);
      setAdminUser(null);
    }
  };

  const isPending = user?.status === 'pending' || company?.status === 'pending';
  const isApproved = company?.status === 'approved' && user?.status === 'active';

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        token,
        isAuthenticated: !!user,
        isPending,
        isApproved,
        loading,
        login,
        register,
        refreshSession,
        demoLogin,
        updateProfile,
        logout,
        // Admin Auth
        adminUser,
        adminToken,
        isAdmin: !!adminUser && adminUser.role === 'admin',
        adminLogin,
        adminLogout,
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
