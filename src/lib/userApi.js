import axios from 'axios';

const BackendUrl = import.meta.env.VITE_BACKEND_URL;

// Get auth token from session storage
const getAuthToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
};

// Create axios instance with default headers
const apiClient = axios.create({
  baseURL: `${BackendUrl}/api/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User API functions
export const userApi = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await apiClient.get('/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put('/update', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async () => {
    try {
      const response = await apiClient.delete('/delete');
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};
