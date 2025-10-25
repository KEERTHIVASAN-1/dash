import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Token changes are picked up by api interceptors via localStorage.
  useEffect(() => {
    // No-op: api reads token from localStorage on each request.
  }, [token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      // Check for OAuth callback
      const urlParams = new URLSearchParams(window.location.search);
      const callbackToken = urlParams.get('token');
      const callbackRole = urlParams.get('role');
      
      if (callbackToken) {
        localStorage.setItem('token', callbackToken);
        setToken(callbackToken);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Redirect based on role
        if (callbackRole === 'teacher' || callbackRole === 'admin') {
          window.location.href = '/teacher-dashboard';
        } else {
          window.location.href = '/';
        }
        return;
      }
      
      if (token) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async () => {
    try {
      // Redirect to Google OAuth on the backend server
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      window.location.href = `${baseUrl}/api/auth/google`;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data.user);
      toast.success('Profile updated successfully');
      return response.data.user;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.user);
      toast.success('Profile refreshed');
      return response.data.user;
    } catch (error) {
      console.error('Refresh profile error:', error);
      toast.error('Failed to refresh profile');
      throw error;
    }
  };

  const hasRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAdmin = () => hasRole(['admin']);
  const isTeacher = () => hasRole(['teacher', 'admin']);
  const isStudent = () => hasRole(['student', 'teacher', 'admin']);

  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    refreshProfile,
    hasRole,
    isAdmin,
    isTeacher,
    isStudent,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
