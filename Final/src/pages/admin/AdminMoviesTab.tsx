import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Search } from 'lucide-react';
import { getAllMovies, deleteMovie } from '@/lib/api';
import { Movie } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const AdminMoviesTab: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies);
    }
  }, [movies, searchQuery]);

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const response = await getAllMovies();
      setMovies(response.data);
      setFilteredMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load movies. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMovie = (movieId: string) => {
    navigate(`/admin/movies/${movieId}/edit`);
  };

  const handleDeleteMovie = async () => {
    if (!movieToDelete) return;

    try {
      setIsDeleting(true);
      await deleteMovie(movieToDelete._id);

      setMovies(prevMovies => prevMovies.filter(movie => movie._id !== movieToDelete._id));

      toast({
        title: 'Movie deleted',
        description: `"${movieToDelete.title}" has been deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete movie. Please try again.',
      });
    } finally {
      setIsDeleting(false);
      setMovieToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        {/* Search Input */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search movies by title or genre..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-12 w-full rounded-xl bg-black/20 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300"
            />
          </div>
        </div>

        {/* Movies Table */}
        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-black/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-black/40">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Movie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Genre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-8 bg-white/10 rounded animate-pulse"></div>
                          <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-white/10 rounded w-1/2 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-white/10 rounded w-1/4 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-white/10 rounded w-1/4 animate-pulse"></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="h-4 bg-white/10 rounded w-1/2 ml-auto animate-pulse"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredMovies.length > 0 ? (
                  filteredMovies.map(movie => (
                    <tr key={movie._id} className="hover:bg-black/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="h-10 w-auto rounded-lg"
                          />
                          <div className="text-sm font-medium text-white">{movie.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {movie.genre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {movie.duration} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {movie.releaseYear}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditMovie(movie._id)}
                            className="text-gray-300 hover:text-purple-400 hover:bg-white/10 rounded-xl transition-all duration-200"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-300 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                            onClick={() => setMovieToDelete(movie)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                      No movies found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!movieToDelete} onOpenChange={open => !open && setMovieToDelete(null)}>
          <DialogContent className="bg-black/80 border border-white/20 backdrop-blur-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-semibold drop-shadow-md">
                Delete Movie
              </DialogTitle>
              <DialogDescription className="text-gray-300 font-light">
                Are you sure you want to delete "{movieToDelete?.title}"? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="space-x-4">
              <Button
                variant="outline"
                onClick={() => setMovieToDelete(null)}
                disabled={isDeleting}
                className="bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-xl transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteMovie}
                disabled={isDeleting}
                className="rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all duration-200"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminMoviesTab;