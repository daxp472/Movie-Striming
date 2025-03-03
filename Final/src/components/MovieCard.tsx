import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { Movie } from '@/types';
import { formatDuration } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isApproved = user?.isApproved;

  return (
    <Card className="overflow-hidden group relative transition-all duration-300 hover:shadow-xl">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="space-y-2">
            <h3 className="text-white font-bold truncate">{movie.title}</h3>
            <div className="flex items-center text-gray-300 text-sm space-x-2">
              <span>{movie.releaseYear}</span>
              <span>•</span>
              <span>{formatDuration(movie.duration)}</span>
              <span>•</span>
              <span>{movie.genre}</span>
            </div>
            <div className="flex space-x-2 pt-2">
              <Button 
                size="sm" 
                className="flex items-center space-x-1"
                onClick={() => navigate(`/movies/${movie._id}`)}
              >
                <Info className="h-4 w-4" />
                <span>Details</span>
              </Button>
              {isApproved && (
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="flex items-center space-x-1"
                  onClick={() => navigate(`/movies/${movie._id}/watch`)}
                >
                  <Play className="h-4 w-4" />
                  <span>Watch</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{movie.title}</h3>
        <p className="text-sm text-gray-500">{movie.genre} • {movie.releaseYear}</p>
      </CardContent>
    </Card>
  );
};

export default MovieCard;