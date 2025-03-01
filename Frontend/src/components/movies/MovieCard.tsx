import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiPlus, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { movieEndpoints } from '@/config/api';

interface MovieCardProps {
  movie: {
    _id: string;
    title: string;
    thumbnail: string;
    genre: string[];
    duration: number;
    status: string;
  };
  inWatchlist?: boolean;
  onWatchlistChange?: () => void;
}

export default function MovieCard({ movie, inWatchlist, onWatchlistChange }: MovieCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleWatchlistToggle = async () => {
    try {
      setIsLoading(true);
      if (inWatchlist) {
        await movieEndpoints.removeFromWatchlist(movie._id);
        toast.success('Removed from watchlist');
      } else {
        await movieEndpoints.addToWatchlist(movie._id);
        toast.success('Added to watchlist');
      }
      onWatchlistChange?.();
    } catch (error) {
      toast.error('Failed to update watchlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg">
      <img
        src={movie.thumbnail}
        alt={movie.title}
        className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          {movie.status === 'approved' ? (
            <Link
              to={`/movies/${movie._id}`}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90"
            >
              <FiPlay /> Watch Now
            </Link>
          ) : (
            <span className="text-yellow-400">Pending Approval</span>
          )}
          <button
            onClick={handleWatchlistToggle}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full hover:bg-white/20"
          >
            {inWatchlist ? <FiCheck /> : <FiPlus />}
            {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{movie.title}</h3>
        <p className="text-sm text-gray-500">{movie.genre.join(', ')}</p>
        <p className="text-sm text-gray-500">
          {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
        </p>
      </div>
    </div>
  );
}
