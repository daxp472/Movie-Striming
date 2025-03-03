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
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="aspect-[2/3] bg-gray-200 rounded-lg"></div>
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
        <p className="mb-6">The movie you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/movies')}>Back to Movies</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[50vh] bg-black">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${movie.posterUrl})`,
            filter: 'blur(8px)',
            opacity: 0.3
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>
      
      {/* Movie Details */}
      <div className="container mx-auto px-4 -mt-40 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <img 
              src={movie.posterUrl} 
              alt={movie.title} 
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
          
          <div className="md:col-span-2 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{movie.releaseYear}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatDuration(movie.duration)}</span>
              </div>
              <div className="flex items-center">
                <Film className="h-4 w-4 mr-1" />
                <span>{movie.genre}</span>
              </div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-2">Overview</h3>
              <p className="text-gray-300">{movie.description}</p>
            </div>
            
            <div className="flex space-x-4">
              {isApproved ? (
                <Button 
                  onClick={() => navigate(`/movies/${movie._id}/watch`)}
                  className="flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Watch Now</span>
                </Button>
              ) : (
                <div className="bg-yellow-500/20 text-yellow-300 px-4 py-2 rounded-md text-sm">
                  {user ? 'Your account needs approval to watch movies' : 'Sign in to watch this movie'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;