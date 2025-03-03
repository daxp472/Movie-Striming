import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Clapperboard } from 'lucide-react';
import { getAllMovies } from '@/lib/api';
import { Movie } from '@/types';
import { Button } from '@/components/ui/button';
import MovieCard from '@/components/MovieCard';
import { useAuth } from '@/context/AuthContext';

const HomePage: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getAllMovies();
        const movies = response.data;

        // Get featured movies (random selection)
        const shuffled = [...movies].sort(() => 0.5 - Math.random());
        setFeaturedMovies(shuffled.slice(0, 5));

        // Get recent movies (sorted by date)
        const sorted = [...movies].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentMovies(sorted.slice(0, 8));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const featuredMovie = featuredMovies[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      {/* Hero Section */}
      {featuredMovie && (
        <div className="relative h-[70vh] bg-black overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${featuredMovie.posterUrl})`,
              filter: 'blur(12px)',
              opacity: 0.2,
              transform: 'scale(1.1)', // Slight zoom for smoother blur edges
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent backdrop-blur-sm" />

          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-md">
                  {featuredMovie.title}
                </h1>
                <p className="text-gray-300 font-light line-clamp-3 md:line-clamp-4">
                  {featuredMovie.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>{featuredMovie.releaseYear}</span>
                  <span>•</span>
                  <span>{featuredMovie.genre}</span>
                  <span>•</span>
                  <span>{featuredMovie.duration} min</span>
                </div>
                <div className="flex space-x-4">
                  <Button
                    onClick={() => navigate(`/movies/${featuredMovie._id}`)}
                    className="flex items-center space-x-2 rounded-xl bg-purple-600 text-white font-medium py-3 px-6 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    <Film className="h-5 w-5" />
                    <span>View Details</span>
                  </Button>
                  {isAuthenticated && user?.isApproved && (
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/movies/${featuredMovie._id}/watch`)}
                      className="flex items-center space-x-2 rounded-xl bg-white/10 text-white font-medium py-3 px-6 hover:bg-white/20 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 border border-white/20"
                    >
                      <Clapperboard className="h-5 w-5" />
                      <span>Watch Now</span>
                    </Button>
                  )}
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src={featuredMovie.posterUrl}
                  alt={featuredMovie.title}
                  className="rounded-2xl shadow-2xl shadow-black/50 max-h-[500px] mx-auto border border-white/20 transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Featured Movies */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-md">Featured Movies</h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/movies')}
              className="text-purple-400 hover:text-purple-300 hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              View All
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] bg-white/10 rounded-2xl animate-pulse border border-white/20"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {featuredMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}
        </section>

        {/* Recently Added */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-md">Recently Added</h2>
            <Button
              variant="ghost"
              onClick={() => navigate('/movies')}
              className="text-purple-400 hover:text-purple-300 hover:bg-white/10 rounded-xl transition-all duration-200"
            >
              View All
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[2/3] bg-white/10 rounded-2xl animate-pulse border border-white/20"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentMovies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;