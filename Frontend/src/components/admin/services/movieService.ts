import { Movie, SeriesBatch } from '../interfaces/Movie';

const API_URL = 'http://localhost:3000/api/admin';

export const movieService = {
  createMovie: async (movieData: FormData): Promise<Movie> => {
    const response = await fetch(`${API_URL}/movies`, {
      method: 'POST',
      body: movieData
    });
    if (!response.ok) throw new Error('Failed to create movie');
    return response.json();
  },

  updateMovie: async (movieId: string, movieData: FormData): Promise<Movie> => {
    const response = await fetch(`${API_URL}/movies/${movieId}`, {
      method: 'PUT',
      body: movieData
    });
    if (!response.ok) throw new Error('Failed to update movie');
    return response.json();
  },

  deleteMovie: async (movieId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/movies/${movieId}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete movie');
  },

  uploadSeriesBatch: async (batchData: FormData): Promise<SeriesBatch> => {
    const response = await fetch(`${API_URL}/movies/series-batch`, {
      method: 'POST',
      body: batchData
    });
    if (!response.ok) throw new Error('Failed to upload series batch');
    return response.json();
  }
};