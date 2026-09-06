import axios from 'axios';

const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  import.meta.env.VITE_API_URL || 
  'http://52.66.241.245:8080';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 12000
});

// Request Interceptor: Attach JWT Bearer Token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract backend ApiResponse payload uniformly
axiosClient.interceptors.response.use(
  (response) => {
    // If backend returns { success: true, data: ..., message: ... }
    return response.data;
  },
  (error) => {
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'A network error occurred. Please check if the backend server is running.';

    // Check if user is deactivated
    const isDeactivated = 
      (error.response?.status === 403 || error.response?.status === 401) &&
      errorMessage.toLowerCase().includes('deactivated');

    if (isDeactivated) {
      console.warn('Account is deactivated. Purging session credentials.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:deactivated', { 
          detail: { message: errorMessage } 
        }));
      }
    } else if (error.response && error.response.status === 401) {
      console.warn('Session expired or unauthorized.');
    }

    const customError = new Error(errorMessage);
    customError.response = error.response;
    customError.status = error.response?.status;
    customError.isDeactivated = isDeactivated;
    return Promise.reject(customError);
  }
);

export default axiosClient;
