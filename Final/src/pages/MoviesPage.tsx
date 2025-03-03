import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getAllMovies } from '@/lib/api';
import { Movie } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MovieCard from '@/components/MovieCard';

const genres = [
  'All Genres', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
];

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await getAllMovies();
        setMovies(response.data);
        setFilteredMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    let result = movies;

    if (searchQuery) {
      result = result.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre !== 'All Genres') {
      result = result.filter(movie => movie.genre === selectedGenre);
    }

    switch (sortBy) {
      case 'newest':
        result = [...result].sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'oldest':
        result = [...result].sort((a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'title-asc':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredMovies(result);
  }, [movies, searchQuery, selectedGenre, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md mb-8">
          Movies
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 focus:border-transparent transition-all duration-300"
            />
          </div>

          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent className="bg-black/80 border border-white/20 text-white backdrop-blur-md rounded-xl">
              {genres.map((genre) => (
                <SelectItem
                  key={genre}
                  value={genre}
                  className="hover:bg-purple-600/20 focus:bg-purple-600/30 transition-colors duration-200"
                >
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-black/80 border border-white/20 text-white backdrop-blur-md rounded-xl">
              <SelectItem value="newest" className="hover:bg-purple-600/20 focus:bg-purple-600/30 transition-colors duration-200">
                Newest First
              </SelectItem>
              <SelectItem value="oldest" className="hover:bg-purple-600/20 focus:bg-purple-600/30 transition-colors duration-200">
                Oldest First
              </SelectItem>
              <SelectItem value="title-asc" className="hover:bg-purple-600/20 focus:bg-purple-600/30 transition-colors duration-200">
                Title (A-Z)
              </SelectItem>
              <SelectItem value="title-desc" className="hover:bg-purple-600/20 focus:bg-purple-600/30 transition-colors duration-200">
                Title (Z-A)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-white/10 rounded-2xl animate-pulse border border-white/20"
              />
            ))}
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-black/30 rounded-2xl border border-white/20 backdrop-blur-md">
            <h3 className="text-xl font-medium text-gray-300 drop-shadow-md">
              No movies found
            </h3>
            <p className="text-gray-400 mt-2 font-light">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviesPage;