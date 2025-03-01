import React, { useState } from 'react';
import MovieCard from '../../components/movies/MovieCard';
import { Trash2 } from 'lucide-react';

// Mock data
const watchlistMovies = [
  {
    id: '1',
    title: 'Inception',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Sci-Fi', 'Action'],
    duration: 148,
    rating: 8.8
  },
  {
    id: '2',
    title: 'The Dark Knight',
    thumbnail: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Action', 'Crime'],
    duration: 152,
    rating: 9.0
  },
  {
    id: '3',
    title: 'Interstellar',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Sci-Fi', 'Adventure'],
    duration: 169,
    rating: 8.6
  },
  {
    id: '4',
    title: 'The Shawshank Redemption',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Drama', 'Crime'],
    duration: 142,
    rating: 9.3
  }
];

const WatchlistPage: React.FC = () => {
  const [movies, setMovies] = useState(watchlistMovies);

  const removeFromWatchlist = (id: string) => {
    setMovies(movies.filter(movie => movie.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Watchlist</h1>
        <p className="text-gray-400">Movies and shows you want to watch</p>
      </div>
      
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="relative group">
              <MovieCard {...movie} />
              <button
                onClick={() => removeFromWatchlist(movie.id)}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
          <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Trash2 className="h-12 w-12 text-gray-500" />
          </div>
          <h2 className="text-xl font-medium text-white mb-2">Your watchlist is empty</h2>
          <p className="text-gray-400 text-center max-w-md mb-6">
            Add movies and shows to your watchlist to keep track of what you want to watch.
          </p>
          <a
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700"
          >
            Browse Movies
          </a>
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;