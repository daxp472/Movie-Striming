import axios from 'axios';

// Base URLs for different services
const AUTH_BASE_URL = 'http://localhost:4000/api';
const MOVIE_BASE_URL = 'http://localhost:5000/api';
const ADMIN_BASE_URL = 'http://localhost:5002/api';

// Create axios instances with interceptors
const createApiInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for adding token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for handling errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const authApi = createApiInstance(AUTH_BASE_URL);
export const movieApi = createApiInstance(MOVIE_BASE_URL);
export const adminApi = createApiInstance(ADMIN_BASE_URL);

// Auth API endpoints
export const authEndpoints = {
  register: (data: { name: string; email: string; password: string }) =>
    authApi.post('/auth/register', data),
  
  verify: (data: { email: string; code: string }) =>
    authApi.post('/auth/verify', data),
  
  login: (data: { email: string; password: string }) =>
    authApi.post('/auth/login', data),
  
  forgotPassword: (data: { email: string }) =>
    authApi.post('/auth/forgot-password', data),
  
  resetPassword: (data: { token: string; password: string }) =>
    authApi.post('/auth/reset-password', data),
    
  getProfile: () => authApi.get('/auth/profile'),
  
  updateProfile: (data: { name?: string; password?: string }) =>
    authApi.put('/auth/profile', data),
};

// Movie API endpoints
export const movieEndpoints = {
  // Movie browsing
  getMovies: (params?: { 
    page?: number; 
    limit?: number; 
    genre?: string; 
    search?: string;
    sort?: 'latest' | 'popular' | 'rating';
  }) => movieApi.get('/movies', { params }),
  
  getMovie: (id: string) => movieApi.get(`/movies/${id}`),
  
  // Watch history
  getWatchHistory: (params?: { 
    page?: number; 
    limit?: number; 
    sort?: 'recent' | 'mostWatched';
  }) => movieApi.get('/history', { params }),
  
  addToHistory: (data: { 
    movieId: string; 
    progress: number; 
    completed: boolean;
  }) => movieApi.post('/history', data),
  
  clearHistory: () => movieApi.delete('/history'),
  
  // Watchlist
  getWatchlist: () => movieApi.get('/watchlist'),
  
  addToWatchlist: (movieId: string) =>
    movieApi.post(`/watchlist/${movieId}`),
  
  removeFromWatchlist: (movieId: string) =>
    movieApi.delete(`/watchlist/${movieId}`),
  
  // User preferences
  getPreferences: () => movieApi.get('/preferences'),
  
  updatePreferences: (data: {
    preferredGenres?: string[];
    language?: string;
    subtitles?: boolean;
    autoplay?: boolean;
    notifications?: boolean;
  }) => movieApi.put('/preferences', data),
  
  // Movie progress
  updateProgress: (movieId: string, data: { 
    progress: number; 
    completed: boolean;
  }) => movieApi.post(`/movies/${movieId}/progress`, data),
  
  getStreamUrl: (movieId: string) => 
    movieApi.get(`/movies/${movieId}/stream`),
};

// Admin API endpoints
export const adminEndpoints = {
  getDashboard: () => adminApi.get('/admin/dashboard'),
  
  // User management
  getUsers: (params?: { 
    page?: number; 
    limit?: number; 
    status?: string;
  }) => adminApi.get('/admin/users', { params }),
  
  updateUserStatus: (userId: string, status: string) =>
    adminApi.put(`/admin/users/${userId}/status`, { status }),
  
  // Movie management
  getMovieRequests: (params?: { 
    page?: number; 
    limit?: number; 
    status?: string;
  }) => adminApi.get('/admin/movies/requests', { params }),
  
  approveMovie: (movieId: string) =>
    adminApi.put(`/admin/movies/${movieId}/approve`),
  
  rejectMovie: (movieId: string) =>
    adminApi.put(`/admin/movies/${movieId}/reject`),
  
  addMovie: (data: FormData) => 
    adminApi.post('/admin/movies', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  updateMovie: (movieId: string, data: FormData) =>
    adminApi.put(`/admin/movies/${movieId}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  deleteMovie: (movieId: string) =>
    adminApi.delete(`/admin/movies/${movieId}`),
  
  // Analytics
  getAnalytics: (params?: { 
    startDate?: string; 
    endDate?: string;
  }) => adminApi.get('/admin/analytics', { params }),
};
