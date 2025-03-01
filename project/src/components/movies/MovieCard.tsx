import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Star, Clock, Plus } from 'lucide-react';

interface MovieCardProps {
  id: string;
  title: string;
  thumbnail: string;
  genres: string[];
  duration: number;
  rating: number;
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  thumbnail,
  genres,
  duration,
  rating
}) => {
  return (
    <div className="group relative overflow-hidden rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80"></div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex flex-col items-center space-y-3">
            <Link
              to={`/watch/${id}`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-transform duration-300 hover:scale-110"
            >
              <Play size={24} fill="white" />
            </Link>
            <div className="flex space-x-2">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                <Plus size={16} />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                <Clock size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-white line-clamp-1">{title}</h3>
          <div className="flex items-center space-x-1">
            <Star size={14} className="text-yellow-400" fill="currentColor" />
            <span className="text-xs font-medium text-gray-300">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-gray-400 line-clamp-1">
            {genres.slice(0, 2).join(', ')}
          </p>
          <span className="text-xs text-gray-400">{Math.floor(duration / 60)}h {duration % 60}m</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;