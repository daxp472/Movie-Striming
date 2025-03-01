import axios from 'axios';

// Base URLs for different services
const AUTH_BASE_URL = 'http://localhost:4000/api';
const USER_BASE_URL = 'http://localhost:5001/api';
const ADMIN_BASE_URL = 'http://localhost:5002/api';

// Create axios instances with interceptors
const createApiInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
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

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        // Handle token expiration
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// API instances
export const authApi = createApiInstance(AUTH_BASE_URL);
export const userApi = createApiInstance(USER_BASE_URL);
export const adminApi = createApiInstance(ADMIN_BASE_URL);

// Auth API endpoints
export const authEndpoints = {
  login: '/auth/login',
  register: '/auth/register',
  verify: '/auth/verify',
  refreshToken: '/auth/refresh-token',
  resetPassword: '/auth/reset-password',
  requestPasswordReset: '/auth/request-password-reset',
};

// User API endpoints
export const userEndpoints = {
  movies: '/movies',
  movie: (id: string) => `/movies/${id}`,
  watchlist: '/user/watchlist',
  addToWatchlist: (id: string) => `/user/watchlist/${id}`,
  removeFromWatchlist: (id: string) => `/user/watchlist/${id}`,
  history: '/user/history',
  addToHistory: '/user/history',
  profile: '/user/profile',
  updateProfile: '/user/profile',
  preferences: '/user/preferences',
  updatePreferences: '/user/preferences',
};

// Admin API endpoints
export const adminEndpoints = {
  dashboard: '/admin/dashboard',
  movies: '/admin/movies',
  movie: (id: string) => `/admin/movies/${id}`,
  addMovie: '/admin/movies',
  updateMovie: (id: string) => `/admin/movies/${id}`,
  deleteMovie: (id: string) => `/admin/movies/${id}`,
  users: '/admin/users',
  user: (id: string) => `/admin/users/${id}`,
  updateUser: (id: string) => `/admin/users/${id}`,
  deleteUser: (id: string) => `/admin/users/${id}`,
};
