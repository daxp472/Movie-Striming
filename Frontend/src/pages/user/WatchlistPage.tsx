import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import MovieCard from '@/components/movies/MovieCard';
import { movieEndpoints } from '@/config/api';

interface Movie {
  _id: string;
  title: string;
  thumbnail: string;
  genre: string[];
  duration: number;
  status: string;
}

export default function WatchlistPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWatchlist = async () => {
    try {
      setIsLoading(true);
      const response = await movieEndpoints.getWatchlist();
      setMovies(response.data.movies);
    } catch (error) {
      toast.error('Failed to load watchlist');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">My Watchlist</h1>
      
      {movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Your watchlist is empty</p>
          <p className="text-gray-500">Add movies to watch them later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              inWatchlist={true}
              onWatchlistChange={loadWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
