// import React, { createContext, useState, useEffect } from 'react';
// import axiosInstance from '../config/axios.config';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (token) {
//       localStorage.setItem('token', token);
//       // Set default authorization header for all requests
//       axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//       localStorage.removeItem('token');
//       delete axiosInstance.defaults.headers.common['Authorization'];
//     }
//   }, [token]);

//   useEffect(() => {
//     const initializeAuth = async () => {
//       if (token) {
//         try {
//           const response = await axiosInstance.get('/user/details');
//           if (response.status === 200) {
//             setUser(response.data);
//           }
//         } catch (error) {
//           console.error('Error fetching user:', error);
//           setToken(null);
//           setUser(null);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, [token]);

//   const login = async (credentials) => {
//     try {
//       const response = await axiosInstance.post('/api/auth/login', credentials);
//       const { token: newToken, user: userData } = response.data;
//       setToken(newToken);
//       setUser(userData);
//       return { success: true };
//     } catch (error) {
//       console.error('Login error:', error);
//       return { 
//         success: false, 
//         error: error.response?.data?.message || 'Login failed' 
//       };
//     }
//   };

//   const signup = async (userData) => {
//     try {
//       const response = await axiosInstance.post('/api/auth/signup', userData);
//       const { token: newToken, user: newUser } = response.data;
//       setToken(newToken);
//       setUser(newUser);
//       return { success: true };
//     } catch (error) {
//       console.error('Signup error:', error);
//       return { 
//         success: false, 
//         error: error.response?.data?.message || 'Signup failed' 
//       };
//     }
//   };

//   const logout = () => {
//     setToken(null);
//     setUser(null);
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     signup,
//     logout,
//     setUser,
//     setToken
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;