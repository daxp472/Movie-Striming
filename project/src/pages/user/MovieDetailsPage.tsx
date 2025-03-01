import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Plus, Clock, Star, Share2, Download, Bookmark, BookmarkCheck } from 'lucide-react';

// Mock data
const movieDetails = {
  id: '1',
  title: 'Inception',
  description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
  backdropUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
  posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
  genres: ['Sci-Fi', 'Action', 'Thriller'],
  duration: 148,
  releaseDate: '2010-07-16',
  rating: 8.8,
  director: 'Christopher Nolan',
  cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page', 'Tom Hardy', 'Ken Watanabe', 'Cillian Murphy'],
  languages: ['English', 'Hindi'],
  trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0'
};

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  
  // In a real app, you would fetch the movie details based on the ID
  // const movie = useMovieDetails(id);
  const movie = movieDetails;

  const toggleWatchlist = () => {
    setIsInWatchlist(!isInWatchlist);
  };

  return (
    <div className="pb-10">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black"></div>
        </div>
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-8">
              {/* Poster */}
              <div className="hidden md:block w-64 rounded-lg overflow-hidden shadow-2xl shadow-purple-500/20 border border-white/10">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-auto"
                />
              </div>
              
              {/* Movie Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center space-x-4 mb-4 text-sm text-gray-300">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                    <span>{movie.rating.toFixed(1)}</span>
                  </div>
                  <span>{movie.releaseDate.split('-')[0]}</span>
                  <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                  <span>{movie.genres.join(', ')}</span>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <Link
                    to={`/watch/${movie.id}`}
                    className="flex items-center space-x-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-white transition-all hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Play size={20} fill="white" />
                    <span>Play</span>
                  </Link>
                  
                  <button
                    onClick={toggleWatchlist}
                    className="flex items-center space-x-2 rounded-md bg-white/10 px-6 py-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    {isInWatchlist ? (
                      <>
                        <BookmarkCheck size={20} />
                        <span>In Watchlist</span>
                      </>
                    ) : (
                      <>
                        <Bookmark size={20} />
                        <span>Add to Watchlist</span>
                      </>
                    )}
                  </button>
                  
                  <button className="flex items-center space-x-2 rounded-md bg-black/40 px-6 py-3 text-white backdrop-blur-sm transition-all hover:bg-black/60">
                    <Share2 size={20} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="container mx-auto px-4 md:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Synopsis</h2>
              <p className="text-gray-300">{movie.description}</p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Cast & Crew</h2>
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Director</h3>
                <p className="text-white">{movie.director}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-white"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Release Date</h3>
                  <p className="text-white">{new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Genres</h3>
                  <p className="text-white">{movie.genres.join(', ')}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Duration</h3>
                  <p className="text-white">{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Languages</h3>
                  <p className="text-white">{movie.languages.join(', ')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-800/40 to-indigo-800/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Watch Offline</h2>
              <p className="text-gray-300 mb-4">Download this movie to watch offline with our premium subscription.</p>
              <button className="w-full flex items-center justify-center space-x-2 rounded-md bg-white/20 px-6 py-3 text-white backdrop-blur-sm transition-all hover:bg-white/30">
                <Download size={20} />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;