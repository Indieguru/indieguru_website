import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../config/axios.config';
import useUserTypeStore from "../store/userTypeStore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setUserType } = useUserTypeStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await axiosInstance.get('/user/details');
        if (response.status === 200) {
          setUser(response.data);
          setUserType(response.data.userType || 'student');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
        setUserType('student');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setUserType]);

  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post('/api/auth/login', credentials);
      const { user: userData } = response.data;
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axiosInstance.post('/api/auth/signup', userData);
      const { user: newUser } = response.data;
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/api/auth/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;