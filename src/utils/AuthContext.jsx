import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import endpointFile from '../utils/utils';

const AuthContext = createContext({});

axios.defaults.baseURL = endpointFile ;
axios.defaults.withCredentials = true;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/auth/profile');
        setUser(response.data);
      }
    } catch (error) {
      console.error('Erreur de vérification d\'authentification:', error);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await axios.post('/auth/login', {
        username,
        password,
      });

      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      setUser(user);
      return { success: true, data: user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur de connexion';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('/auth/register', userData);
      
      if (response.data.success) {
        return { 
          success: true, 
          message: 'Compte créé avec succès. Vous recevrez vos identifiants par SMS.' 
        };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erreur d\'inscription';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};