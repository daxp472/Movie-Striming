import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiClock, FiCalendar, FiStar, FiPlus, FiCheck } from 'react-icons/fi';
import MoviePlayer from '@/components/movies/MoviePlayer';
import { movieEndpoints } from '@/config/api';
import { Button } from '@/components/ui/button';

interface Movie {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  genre: string[];
  duration: number;
  rating: number;
  releaseDate: string;
  status: string;
}

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [lastProgress, setLastProgress] = useState(0);

  useEffect(() => {
    if (id) {
      loadMovie();
      checkWatchlist();
      loadProgress();
    }
  }, [id]);

  const loadMovie = async () => {
    try {
      setIsLoading(true);
      const response = await movieEndpoints.getMovie(id!);
      setMovie(response.data);
    } catch (error) {
      toast.error('Failed to load movie details');
    } finally {
      setIsLoading(false);
    }
  };

  const checkWatchlist = async () => {
    try {
      const response = await movieEndpoints.getWatchlist();
      setInWatchlist(response.data.movies.some((m: Movie) => m._id === id));
    } catch (error) {
      console.error('Failed to check watchlist');
    }
  };

  const loadProgress = async () => {
    try {
      const response = await movieEndpoints.getWatchHistory();
      const history = response.data.history.find((h: any) => h.movieId === id);
      if (history) {
        setLastProgress(history.progress);
      }
    } catch (error) {
      console.error('Failed to load progress');
    }
  };

  const handleWatchlistToggle = async () => {
    try {
      if (inWatchlist) {
        await movieEndpoints.removeFromWatchlist(id!);
        toast.success('Removed from watchlist');
      } else {
        await movieEndpoints.addToWatchlist(id!);
        toast.success('Added to watchlist');
      }
      setInWatchlist(!inWatchlist);
    } catch (error) {
      toast.error('Failed to update watchlist');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <p className="text-gray-500">The movie you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {movie.status === 'approved' ? (
        <MoviePlayer movieId={id!} initialProgress={lastProgress} />
      ) : (
        <div className="aspect-video bg-gray-900 flex items-center justify-center">
          <p className="text-yellow-400">This movie is pending approval</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 text-gray-500">
              <span className="flex items-center gap-1">
                <FiClock />
                {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </span>
              <span className="flex items-center gap-1">
                <FiCalendar />
                {new Date(movie.releaseDate).getFullYear()}
              </span>
              <span className="flex items-center gap-1">
                <FiStar className="text-yellow-400" />
                {movie.rating.toFixed(1)}
              </span>
            </div>
          </div>
          <Button
            onClick={handleWatchlistToggle}
            variant={inWatchlist ? "secondary" : "default"}
            className="flex items-center gap-2"
          >
            {inWatchlist ? <FiCheck /> : <FiPlus />}
            {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          </Button>
        </div>

        <div className="flex gap-2">
          {movie.genre.map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700"
            >
              {genre}
            </span>
          ))}
        </div>

        <p className="text-gray-700 leading-relaxed">{movie.description}</p>
      </div>
    </div>
  );
}
