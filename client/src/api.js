import axios from 'axios';

export const BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://resumeai-nyg1.onrender.com' 
  : 'http://localhost:3000';

const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies with requests
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
