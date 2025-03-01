import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Plus, Info } from 'lucide-react';

interface FeaturedMovieProps {
  id: string;
  title: string;
  description: string;
  backdropUrl: string;
  genres: string[];
  duration: number;
  rating: number;
}

const FeaturedMovie: React.FC<FeaturedMovieProps> = ({
  id,
  title,
  description,
  backdropUrl,
  genres,
  duration,
  rating
}) => {
  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center space-x-2">
              <span className="rounded bg-purple-600 px-2 py-1 text-xs font-medium text-white">
                Featured
              </span>
              <span className="rounded bg-black/40 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {rating.toFixed(1)} Rating
              </span>
            </div>
            
            <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              {title}
            </h1>
            
            <div className="mb-4 flex items-center space-x-4 text-sm text-gray-300">
              <span>{Math.floor(duration / 60)}h {duration % 60}m</span>
              <span>{genres.join(', ')}</span>
            </div>
            
            <p className="mb-8 text-base text-gray-300 line-clamp-3 md:text-lg">
              {description}
            </p>
            
            <div className="flex flex-wrap items-center space-x-4">
              <Link
                to={`/watch/${id}`}
                className="flex items-center space-x-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-white transition-all hover:from-purple-700 hover:to-indigo-700"
              >
                <Play size={20} fill="white" />
                <span>Play Now</span>
              </Link>
              
              <button className="flex items-center space-x-2 rounded-md bg-white/10 px-6 py-3 text-white backdrop-blur-sm transition-all hover:bg-white/20">
                <Plus size={20} />
                <span>My List</span>
              </button>
              
              <Link
                to={`/movie/${id}`}
                className="flex items-center space-x-2 rounded-md bg-black/40 px-6 py-3 text-white backdrop-blur-sm transition-all hover:bg-black/60"
              >
                <Info size={20} />
                <span>Details</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMovie;