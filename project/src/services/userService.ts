import { userApi, userEndpoints } from '../config/api';

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  backdropUrl?: string;
  videoUrl?: string;
  genres: string[];
  duration: number;
  rating: number;
  releaseYear?: number;
  director?: string;
  cast?: string[];
}

export interface WatchHistoryItem {
  id: string;
  movieId: string;
  movie: Movie;
  watchedAt: string;
  progress: number;
  completed: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  subscriptionPlan: 'basic' | 'premium' | 'vip';
  subscriptionStatus: 'active' | 'inactive' | 'expired';
  subscriptionExpiry?: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  preferredGenres: string[];
  emailNotifications: boolean;
  autoplay: boolean;
  subtitlesEnabled: boolean;
  subtitlesLanguage: string;
  videoQuality: 'auto' | '720p' | '1080p' | '4k';
}

export const userService = {
  // Movies
  getMovies: async (params?: { genre?: string; page?: number; limit?: number }) => {
    const response = await userApi.get(userEndpoints.movies, { params });
    return response.data;
  },

  getMovie: async (id: string) => {
    const response = await userApi.get(userEndpoints.movie(id));
    return response.data;
  },

  // Watchlist
  getWatchlist: async () => {
    const response = await userApi.get(userEndpoints.watchlist);
    return response.data;
  },

  addToWatchlist: async (movieId: string) => {
    const response = await userApi.post(userEndpoints.addToWatchlist(movieId));
    return response.data;
  },

  removeFromWatchlist: async (movieId: string) => {
    const response = await userApi.delete(userEndpoints.removeFromWatchlist(movieId));
    return response.data;
  },

  // Watch History
  getWatchHistory: async () => {
    const response = await userApi.get(userEndpoints.history);
    return response.data;
  },

  addToHistory: async (data: { movieId: string; progress: number; completed: boolean }) => {
    const response = await userApi.post(userEndpoints.addToHistory, data);
    return response.data;
  },

  // User Profile
  getUserProfile: async () => {
    const response = await userApi.get(userEndpoints.profile);
    return response.data;
  },

  updateUserProfile: async (data: Partial<UserProfile>) => {
    const response = await userApi.put(userEndpoints.updateProfile, data);
    return response.data;
  },

  // User Preferences
  getUserPreferences: async () => {
    const response = await userApi.get(userEndpoints.preferences);
    return response.data;
  },

  updateUserPreferences: async (data: Partial<UserPreferences>) => {
    const response = await userApi.put(userEndpoints.updatePreferences, data);
    return response.data;
  },
};
