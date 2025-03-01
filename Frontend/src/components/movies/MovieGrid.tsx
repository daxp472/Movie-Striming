import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import MovieCard from './MovieCard';
import { movieEndpoints } from '@/config/api';

interface Movie {
  _id: string;
  title: string;
  thumbnail: string;
  genre: string[];
  duration: number;
  status: string;
}

export default function MovieGrid() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadMovies = async () => {
    try {
      const response = await movieEndpoints.getMovies({ page, limit: 12 });
      const newMovies = response.data.movies;
      setMovies(prev => [...prev, ...newMovies]);
      setHasMore(newMovies.length === 12);
    } catch (error) {
      toast.error('Failed to load movies');
    } finally {
      setIsLoading(false);
    }
  };

  const loadWatchlist = async () => {
    try {
      const response = await movieEndpoints.getWatchlist();
      setWatchlist(response.data.movies.map((m: Movie) => m._id));
    } catch (error) {
      console.error('Failed to load watchlist');
    }
  };

  useEffect(() => {
    loadMovies();
    loadWatchlist();
  }, [page]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map(movie => (
          <MovieCard
            key={movie._id}
            movie={movie}
            inWatchlist={watchlist.includes(movie._id)}
            onWatchlistChange={loadWatchlist}
          />
        ))}
      </div>
      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {!isLoading && hasMore && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
