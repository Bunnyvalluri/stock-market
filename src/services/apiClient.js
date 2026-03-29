import axios from 'axios';

// The base URL will point to your future Node.js / Python backend.
// Use environment variables for production (e.g., import.meta.env.VITE_API_URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a configured Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout for deep learning inference routes
});

// ==========================================
// REQUEST INTERCEPTOR (JWT Authentication)
// ==========================================
apiClient.interceptors.request.use(
  (config) => {
    // Check localStorage for the JWT token set during Login
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Append JWT to every protected request
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// RESPONSE INTERCEPTOR (Error & Token Management)
// ==========================================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns a 401 Unauthorized, automatically log the user out on the frontend
    if (error.response && error.response.status === 401) {
      console.warn('JWT Expired or Invalid. Redirecting to login...');
      localStorage.removeItem('auth_token');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

/**
 * ============================================================================
 * API ENDPOINTS MAPPING (As per API.md Specification)
 * ============================================================================
 */

export const api = {
  // ----------------------------------------
  // Auth
  // ----------------------------------------
  auth: {
    /** 
     * POST /api/signup
     * @param {Object} userData - { email, password, name } 
     */
    signup: async (userData) => {
      const response = await apiClient.post('/signup', userData);
      return response.data;
    },
    
    /** 
     * POST /api/login
     * @param {Object} credentials - { email, password } 
     */
    login: async (credentials) => {
      const response = await apiClient.post('/login', credentials);
      return response.data;
    }
  },

  // ----------------------------------------
  // Stocks
  // ----------------------------------------
  stocks: {
    /** 
     * GET /api/stocks
     * Retrieve the global market overview / active tickers
     */
    getAll: async () => {
      const response = await apiClient.get('/stocks');
      return response.data;
    },
    
    /** 
     * GET /api/stocks/:symbol
     * Retrieve detailed historical OHLCV data for a specific asset
     */
    getBySymbol: async (symbol) => {
      const response = await apiClient.get(`/stocks/${symbol}`);
      return response.data;
    }
  },

  // ----------------------------------------
  // Prediction
  // ----------------------------------------
  prediction: {
    /** 
     * GET /api/predict/:symbol
     * Triggers the LSTM/Random Forest backend ML inference
     */
    get: async (symbol) => {
      const response = await apiClient.get(`/predict/${symbol}`);
      return response.data;
    }
  },

  // ----------------------------------------
  // Portfolio
  // ----------------------------------------
  portfolio: {
    /** 
     * GET /api/portfolio
     * Retrieve the authenticated user's portfolio holdings and P&L
     */
    get: async () => {
      const response = await apiClient.get('/portfolio');
      return response.data;
    },
    
    /** 
     * POST /api/portfolio
     * Add a new trade / holding to the user's account
     * @param {Object} tradeData - { symbol, shares, buyPrice, matchId }
     */
    add: async (tradeData) => {
      const response = await apiClient.post('/portfolio', tradeData);
      return response.data;
    }
  },

  // ----------------------------------------
  // News
  // ----------------------------------------
  news: {
    /** 
     * GET /api/news/:symbol
     * Fetch NLP sentiment-analyzed financial news articles
     */
    getBySymbol: async (symbol) => {
      const response = await apiClient.get(`/news/${symbol}`);
      return response.data;
    }
  },

  // ----------------------------------------
  // Alerts
  // ----------------------------------------
  alerts: {
    /** 
     * POST /api/alerts
     * Subscribe to a webhook / push notification for a price or AI threshold
     * @param {Object} alertConfig - { symbol, condition, threshold }
     */
    create: async (alertConfig) => {
      const response = await apiClient.post('/alerts', alertConfig);
      return response.data;
    }
  }
};

export default apiClient;
