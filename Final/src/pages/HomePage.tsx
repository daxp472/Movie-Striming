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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      {featuredMovie && (
        <div className="relative h-[70vh] bg-black">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${featuredMovie.posterUrl})`,
              filter: 'blur(8px)',
              opacity: 0.3
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          
          <div className="container mx-auto px-4 h-full flex items-center relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white">{featuredMovie.title}</h1>
                <p className="text-gray-300 line-clamp-3 md:line-clamp-4">{featuredMovie.description}</p>
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
                    className="flex items-center space-x-2"
                  >
                    <Film className="h-4 w-4" />
                    <span>View Details</span>
                  </Button>
                  {isAuthenticated && user?.isApproved && (
                    <Button 
                      variant="secondary"
                      onClick={() => navigate(`/movies/${featuredMovie._id}/watch`)}
                      className="flex items-center space-x-2"
                    >
                      <Clapperboard className="h-4 w-4" />
                      <span>Watch Now</span>
                    </Button>
                  )}
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src={featuredMovie.posterUrl} 
                  alt={featuredMovie.title} 
                  className="rounded-lg shadow-2xl max-h-[500px] mx-auto"
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
            <h2 className="text-2xl font-bold">Featured Movies</h2>
            <Button variant="ghost" onClick={() => navigate('/movies')}>
              View All
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-gray-200 animate-pulse rounded-lg" />
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
            <h2 className="text-2xl font-bold">Recently Added</h2>
            <Button variant="ghost" onClick={() => navigate('/movies')}>
              View All
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-gray-200 animate-pulse rounded-lg" />
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