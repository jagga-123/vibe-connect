import { createContext, useContext, useState } from 'react';
import API from '../services/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vibeconnect_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('vibeconnect_token'));
  const [loading] = useState(false);

  // Handle User Login
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      // Save to state
      setToken(token);
      setUser(userData);

      // Save to localStorage
      localStorage.setItem('vibeconnect_token', token);
      localStorage.setItem('vibeconnect_user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error('Login error details:', error);
      const message =
        error.response?.data?.message ||
        (error.request
          ? 'Backend did not respond. Check VITE_API_URL, CORS, and backend deployment.'
          : 'Login failed. Please check your credentials.');
      return {
        success: false,
        message
      };
    }
  };

  // Handle User Signup
  const signup = async (username, email, password) => {
    try {
      const response = await API.post('/auth/signup', { username, email, password });
      const { token, user: userData } = response.data;

      // Save to state
      setToken(token);
      setUser(userData);

      // Save to localStorage
      localStorage.setItem('vibeconnect_token', token);
      localStorage.setItem('vibeconnect_user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      console.error('Signup error details:', error);
      const message =
        error.response?.data?.message ||
        (error.request
          ? 'Backend did not respond. Check VITE_API_URL, CORS, and backend deployment.'
          : 'Signup failed. Please try again.');
      return {
        success: false,
        message
      };
    }
  };

  // Handle User Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vibeconnect_token');
    localStorage.removeItem('vibeconnect_user');
  };

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    setUser // Allow manual avatar or details updating
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
