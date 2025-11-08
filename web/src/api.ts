import axios from 'axios';

// Create axios instance with base URL
const apiClient = axios.create({
  // Use the VITE_API_BASE_URL from your environment variables.
  // If it's not set (like in local development), it will default to 'http://localhost:5000'.
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to automatically include the auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (assuming it's stored there by your AuthContext)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
