import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, Edit, Trash2, Eye, Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/helpers';

interface Movie {
  id: string;
  title: string;
  releaseYear: number;
  genre: string[];
  duration: number;
  rating: number;
  thumbnailUrl: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  views: number;
}

const Movies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const itemsPerPage = 10;

  const { data: movies, loading, error, refetch } = useApi<Movie[]>(() => 
    adminService.getMovies({ page: currentPage, limit: itemsPerPage, search: searchTerm, genre: selectedGenre, status: selectedStatus })
  );

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [currentPage, searchTerm, selectedGenre, selectedStatus, refetch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
    refetch();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await adminService.deleteMovie(id);
        refetch();
      } catch (err) {
        console.error('Failed to delete movie:', err);
      }
    }
  };

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 
    'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
  ];

  const statuses = ['active', 'inactive', 'pending'];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Movies</h1>
        <Link
          to="/admin/movies/add"
          className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
        >
          <Plus size={18} className="mr-2" />
          Add Movie
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="pl-10 pr-8 py-2 bg-black/40 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 bg-black/40 border border-white/10 rounded-lg text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Movies Table */}
      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            <p>Error loading movies. Please try again.</p>
          </div>
        ) : movies && movies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-black/60">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Movie
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Genre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Release Year
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Views
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Added On
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {movies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-16 flex-shrink-0 rounded overflow-hidden bg-gray-800">
                          {movie.thumbnailUrl ? (
                            <img src={movie.thumbnailUrl} alt={movie.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Film size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{movie.title}</div>
                          <div className="text-sm text-gray-400">{movie.duration} min</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {movie.genre.slice(0, 2).join(', ')}
                        {movie.genre.length > 2 && '...'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{movie.releaseYear}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${movie.status === 'active' ? 'bg-green-100 text-green-800' : 
                          movie.status === 'inactive' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {movie.status.charAt(0).toUpperCase() + movie.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {movie.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(movie.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          to={`/admin/movies/${movie.id}`} 
                          className="text-indigo-400 hover:text-indigo-300"
                          title="View"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link 
                          to={`/admin/movies/edit/${movie.id}`} 
                          className="text-blue-400 hover:text-blue-300"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(movie.id)} 
                          className="text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <Film size={48} className="mx-auto mb-4 opacity-50" />
            <p>No movies found. Add a new movie or change your search filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {movies && movies.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-400">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, movies.length)}</span> of{' '}
            <span className="font-medium">{movies.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-black/40 text-white hover:bg-white/10'
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={movies.length < itemsPerPage}
              className={`p-2 rounded-md ${
                movies.length < itemsPerPage
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-black/40 text-white hover:bg-white/10'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;
