import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Clock, Calendar, Film } from 'lucide-react';
import { getMovie } from '@/lib/api';
import { Movie } from '@/types';
import { Button } from '@/components/ui/button';
import { formatDuration } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isApproved = user?.isApproved;

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;

      try {
        const response = await getMovie(id);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded-2xl w-1/4 mb-8 border border-white/20"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="aspect-[2/3] bg-white/10 rounded-2xl border border-white/20"></div>
              <div className="md:col-span-2 space-y-4">
                <div className="h-10 bg-white/10 rounded-2xl w-3/4 border border-white/20"></div>
                <div className="h-4 bg-white/10 rounded-2xl w-1/2 border border-white/20"></div>
                <div className="h-32 bg-white/10 rounded-2xl border border-white/20"></div>
                <div className="h-12 bg-white/10 rounded-2xl w-1/3 border border-white/20"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center bg-black/30 p-8 rounded-2xl border border-white/20 backdrop-blur-md shadow-lg">
          <h2 className="text-3xl font-bold text-white drop-shadow-md mb-4">
            Movie not found
          </h2>
          <p className="text-gray-300 font-light mb-6">
            The movie you're looking for doesn’t exist or has been removed.
          </p>
          <Button
            onClick={() => navigate('/movies')}
            className="rounded-xl bg-purple-600 text-white font-medium py-3 px-6 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
          >
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-black overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${movie.posterUrl})`,
            filter: 'blur(12px)',
            opacity: 0.2,
            transform: 'scale(1.1)', // Slight zoom for smoother blur edges
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent backdrop-blur-sm" />
        <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md">
              {movie.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-4 text-gray-300 font-light">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-400" />
                <span>{movie.releaseYear}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-400" />
                <span>{formatDuration(movie.duration)}</span>
              </div>
              <div className="flex items-center">
                <Film className="h-5 w-5 mr-2 text-purple-400" />
                <span>{movie.genre}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Details */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="rounded-2xl shadow-2xl shadow-black/50 w-full border border-white/20 transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-2xl font-semibold text-white mb-4 drop-shadow-md">
                Overview
              </h3>
              <p className="text-gray-300 font-light leading-relaxed">
                {movie.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {isApproved ? (
                <Button
                  onClick={() => navigate(`/movies/${movie._id}/watch`)}
                  className="flex items-center space-x-2 rounded-xl bg-purple-600 text-white font-medium py-3 px-6 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                >
                  <Play className="h-5 w-5" />
                  <span>Watch Now</span>
                </Button>
              ) : (
                <div className="bg-yellow-500/20 text-yellow-300 px-4 py-3 rounded-xl text-sm font-medium border border-yellow-500/30 backdrop-blur-sm">
                  {user
                    ? 'Your account needs approval to watch movies'
                    : 'Sign in to watch this movie'}
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => navigate('/movies')}
                className="rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-purple-500/20 transition-all duration-300"
              >
                Back to Movies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;