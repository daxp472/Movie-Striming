import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Error Response Data:', error.response.data);
      console.error('Error Response Status:', error.response.status);
    }
    return Promise.reject(error);
  }
);

// Auth API
export const login = (email: string, password: string) => {
  console.log('Login request for:', email);
  return api.post('/auth/login', { email, password });
};

export const register = (name: string, email: string, password: string) => {
  console.log('Register request for:', email);
  return api.post('/auth/register', { name, email, password });
};

// User API
export const getCurrentUser = () => {
  console.log('Getting current user');
  return api.get('/users/me');
};

export const getAllUsers = () => {
  console.log('Getting all users');
  return api.get('/users');
};

export const approveUser = (userId: string) => {
  console.log('Approving user:', userId);
  return api.patch(`/users/${userId}/approve`);
};

export const rejectUser = (userId: string) => {
  console.log('Rejecting user:', userId);
  return api.patch(`/users/${userId}/reject`);
};

// Movies API
export const getAllMovies = () => {
  console.log('Getting all movies');
  return api.get('/movies');
};

export const getMovie = (id: string) => {
  console.log('Getting movie:', id);
  return api.get(`/movies/${id}`);
};

export const getMovieStream = (id: string) => {
  console.log('Getting movie stream for:', id);
  return api.get(`/movies/${id}/stream`);
};

export const createMovie = (movieData: FormData) => {
  console.log('Creating new movie');
  // Convert FormData to JSON for our new approach
  const movieObject: Record<string, any> = {};
  movieData.forEach((value, key) => {
    movieObject[key] = value;
  });
  
  return api.post('/movies', movieObject);
};

export const updateMovie = (id: string, movieData: FormData) => {
  console.log('Updating movie:', id);
  // Convert FormData to JSON for our new approach
  const movieObject: Record<string, any> = {};
  movieData.forEach((value, key) => {
    movieObject[key] = value;
  });
  
  return api.put(`/movies/${id}`, movieObject);
};

export const deleteMovie = (id: string) => {
  console.log('Deleting movie:', id);
  return api.delete(`/movies/${id}`);
};

// Check available slots for movie uploads
export const checkAvailableSlots = async () => {
  try {
    const response = await api.get('/movies');
    const movies = response.data;
    const totalSlots = 5;
    const usedSlots = movies.length;
    const availableSlots = totalSlots - usedSlots;
    return availableSlots;
  } catch (error) {
    console.error('Error checking available slots:', error);
    throw error;
  }
};

export default api;