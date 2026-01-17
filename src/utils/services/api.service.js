import axios from 'axios';
import { endpoint } from '../utils';

const api = axios.create({
  baseURL: endpoint+'api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const fetchData = async (params = {}) => {
  try {
    const { search, isActive } = params;
    
    const queryParams = new URLSearchParams();
    
    if (search && search.trim() !== '') {
      queryParams.append('search', search.trim());
    }
    
    if (typeof isActive === 'boolean') {
      queryParams.append('isActive', isActive.toString());
    }
    
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());
    
    const queryString = queryParams.toString();
    const url = `/data${queryString ? `?${queryString}` : ''}`;
    
    const response = await api.get(url);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
    
  } catch (error) {
    console.error('Erreur de récupération:', error);
    
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status,
    };
  }
};

export const createData = async (data) => {
  try {
    const response = await api.post('/data', data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message };
  }
};

export const updateData = async (id, data) => {
  try {
    const response = await api.put(`/data/${id}`, data);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.message };
  }
};

export const deleteData = async (id) => {
  try {
    await api.delete(`/data/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.response?.data?.message };
  }
};