import { adminApi, adminEndpoints } from '../config/api';

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

export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  bannerUrl: string;
  videoUrl: string;
  trailerUrl?: string;
  genre: string[];
  duration: number;
  rating: number;
  releaseYear: number;
  director: string;
  cast: string[];
  maturityRating: string;
  status: 'active' | 'inactive' | 'pending';
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  subscriptionTier: 'basic' | 'premium' | 'vip' | 'none';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastLogin: string;
  watchCount: number;
  preferences?: {
    genres: string[];
    notifications: boolean;
    subtitles: boolean;
    language: string;
  };
}

export interface MovieFilters {
  page?: number;
  limit?: number;
  search?: string;
  genre?: string;
  status?: string;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  subscriptionTier?: string;
}

export interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalMovies: number;
    totalWatchTime: number;
    totalRevenue: number;
  };
  userStats: {
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
    userGrowthRate: number;
  };
  contentStats: {
    mostWatchedGenres: { name: string; count: number }[];
    mostWatchedMovies: { id: string; title: string; count: number }[];
    averageWatchTime: number;
  };
  revenueStats: {
    revenueToday: number;
    revenueThisWeek: number;
    revenueThisMonth: number;
    revenueGrowthRate: number;
    subscriptionDistribution: { name: string; count: number; revenue: number }[];
  };
}

export const adminService = {
  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await adminApi.get(adminEndpoints.dashboard);
    return response.data;
  },

  // Movies
  getMovies: async (filters?: MovieFilters): Promise<Movie[]> => {
    const response = await adminApi.get(adminEndpoints.movies, { params: filters });
    return response.data;
  },

  getMovie: async (id: string): Promise<Movie> => {
    const response = await adminApi.get(adminEndpoints.movie(id));
    return response.data;
  },

  addMovie: async (data: Partial<Movie>): Promise<Movie> => {
    const response = await adminApi.post(adminEndpoints.addMovie, data);
    return response.data;
  },

  updateMovie: async (id: string, data: Partial<Movie>): Promise<Movie> => {
    const response = await adminApi.put(adminEndpoints.movie(id), data);
    return response.data;
  },

  deleteMovie: async (id: string): Promise<void> => {
    await adminApi.delete(adminEndpoints.movie(id));
  },

  // Users
  getUsers: async (filters?: UserFilters): Promise<UserProfile[]> => {
    const response = await adminApi.get(adminEndpoints.users, { params: filters });
    return response.data;
  },

  getUser: async (id: string): Promise<UserProfile> => {
    const response = await adminApi.get(adminEndpoints.user(id));
    return response.data;
  },

  updateUser: async (id: string, data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await adminApi.put(adminEndpoints.user(id), data);
    return response.data;
  },

  updateUserStatus: async (id: string, status: 'active' | 'suspended' | 'pending'): Promise<UserProfile> => {
    const response = await adminApi.patch(adminEndpoints.userStatus(id), { status });
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await adminApi.delete(adminEndpoints.user(id));
  },

  // Analytics
  getAnalytics: async (timeRange: '7d' | '30d' | '90d' | '1y'): Promise<AnalyticsData> => {
    const response = await adminApi.get(adminEndpoints.analytics, { params: { timeRange } });
    return response.data;
  },

  // File Uploads
  uploadImage: async (file: File, type: 'thumbnail' | 'banner'): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await adminApi.post(adminEndpoints.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },

  uploadVideo: async (file: File, type: 'main' | 'trailer'): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await adminApi.post(adminEndpoints.uploadVideo, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }
};
