import { adminApi, adminEndpoints } from '../config/api';
import { Movie, UserProfile } from './userService';

export interface DashboardStats {
  totalMovies: number;
  totalUsers: number;
  activeSubscriptions: number;
  recentUsers: UserProfile[];
  popularMovies: Movie[];
  watchStats: {
    today: number;
    week: number;
    month: number;
  };
}

export interface MovieFormData {
  title: string;
  description: string;
  thumbnail: File | null;
  backdrop: File | null;
  video: File | null;
  genres: string[];
  duration: number;
  rating: number;
  releaseYear: number;
  director: string;
  cast: string[];
}

export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await adminApi.get(adminEndpoints.dashboard);
    return response.data;
  },

  // Movies
  getMovies: async (params?: { genre?: string; page?: number; limit?: number }) => {
    const response = await adminApi.get(adminEndpoints.movies, { params });
    return response.data;
  },

  getMovie: async (id: string) => {
    const response = await adminApi.get(adminEndpoints.movie(id));
    return response.data;
  },

  addMovie: async (data: FormData) => {
    const response = await adminApi.post(adminEndpoints.addMovie, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateMovie: async (id: string, data: FormData) => {
    const response = await adminApi.put(adminEndpoints.updateMovie(id), data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteMovie: async (id: string) => {
    const response = await adminApi.delete(adminEndpoints.deleteMovie(id));
    return response.data;
  },

  // Users
  getUsers: async (params?: { role?: string; page?: number; limit?: number }) => {
    const response = await adminApi.get(adminEndpoints.users, { params });
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await adminApi.get(adminEndpoints.user(id));
    return response.data;
  },

  updateUser: async (id: string, data: Partial<UserProfile>) => {
    const response = await adminApi.put(adminEndpoints.updateUser(id), data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await adminApi.delete(adminEndpoints.deleteUser(id));
    return response.data;
  },
};
