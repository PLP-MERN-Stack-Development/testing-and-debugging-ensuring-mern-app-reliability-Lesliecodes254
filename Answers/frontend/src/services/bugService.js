import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

/**
 * Get all bugs
 * @param {Object} filters - Query filters (status, priority)
 * @returns {Promise} - Bug list
 */
export const getAllBugs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    
    const response = await apiClient.get(`/bugs?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get bug by ID
 * @param {string} id - Bug ID
 * @returns {Promise} - Bug object
 */
export const getBugById = async (id) => {
  try {
    const response = await apiClient.get(`/bugs/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create new bug
 * @param {Object} bugData - Bug data
 * @returns {Promise} - Created bug
 */
export const createBug = async (bugData) => {
  try {
    const response = await apiClient.post('/bugs', bugData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update bug
 * @param {string} id - Bug ID
 * @param {Object} updates - Updated fields
 * @returns {Promise} - Updated bug
 */
export const updateBug = async (id, updates) => {
  try {
    const response = await apiClient.put(`/bugs/${id}`, updates);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete bug
 * @param {string} id - Bug ID
 * @returns {Promise} - Success message
 */
export const deleteBug = async (id) => {
  try {
    const response = await apiClient.delete(`/bugs/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get bug statistics
 * @returns {Promise} - Statistics data
 */
export const getBugStats = async () => {
  try {
    const response = await apiClient.get('/bugs/stats');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Handle API errors consistently
 * @param {Error} error - Axios error object
 * @returns {Error} - Formatted error
 */
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.message || 'An error occurred';
    return new Error(message);
  } else if (error.request) {
    // Request made but no response
    return new Error('No response from server. Please check your connection.');
  } else {
    // Error in request setup
    return new Error(error.message || 'An unexpected error occurred');
  }
};

export default {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  getBugStats
};
