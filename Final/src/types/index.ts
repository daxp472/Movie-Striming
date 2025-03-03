export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  genre: string;
  duration: number;
  releaseYear: number;
  posterUrl: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}