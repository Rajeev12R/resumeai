import axios from 'axios';

export const BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://resumeai-nyg1.onrender.com' 
  : 'http://localhost:3000';

const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies with requests
});

export default api;
