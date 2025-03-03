import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, AlertTriangle } from 'lucide-react';
import { getMovie, getMovieStream } from '@/lib/api';
import { Movie } from '@/types';
import { Button } from '@/components/ui/button';
import VideoPlayer from '@/components/VideoPlayer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const WatchMoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMovieAndStream = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching movie with ID:', id);
        console.log('User authentication status:', isAuthenticated);
        console.log('User approval status:', user?.isApproved);
        
        // Fetch movie details
        const movieResponse = await getMovie(id);
        console.log('Movie details fetched:', movieResponse.data);
        setMovie(movieResponse.data);
        
        // Only attempt to fetch stream if user is authenticated and approved
        if (isAuthenticated) {
          if (user?.isApproved || user?.role === 'admin') {
            try {
              console.log('Fetching stream URL for movie:', id);
              const streamResponse = await getMovieStream(id);
              console.log('Stream URL fetched:', streamResponse.data);
              setStreamUrl(streamResponse.data.streamUrl);
            } catch (streamError: any) {
              console.error('Error fetching stream:', streamError);
              const errorMsg = streamError.response?.data?.message || 'Failed to load movie stream';
              console.error('Stream error message:', errorMsg);
              setError(errorMsg);
              toast({
                variant: "destructive",
                title: "Streaming Error",
                description: errorMsg,
              });
            }
          } else {
            // User is authenticated but not approved
            const errorMsg = 'Your account needs to be approved by an admin to watch movies';
            console.error(errorMsg);
            setError(errorMsg);
            toast({
              variant: "destructive",
              title: "Account Not Approved",
              description: "Your account is pending approval from an administrator",
            });
          }
        } else {
          // User is not authenticated
          const errorMsg = 'You need to be logged in to watch movies';
          console.error(errorMsg);
          setError(errorMsg);
          toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "Please log in to watch movies",
          });
        }
      } catch (error: any) {
        console.error('Error fetching movie:', error);
        const errorMsg = error.response?.data?.message || 'Failed to load movie';
        console.error('Movie fetch error message:', errorMsg);
        setError(errorMsg);
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMsg,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieAndStream();
  }, [id, user, isAuthenticated, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
          <p className="text-white text-sm">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="bg-red-500/20 p-4 rounded-full mb-6">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4">{error || 'Movie not found'}</h2>
        <p className="mb-6 text-gray-400 text-center max-w-md">
          {error 
            ? 'You may need to log in or get your account approved by an admin.'
            : 'The movie you\'re looking for doesn\'t exist or has been removed.'}
        </p>
        <div className="flex space-x-4">
          <Button onClick={() => navigate('/movies')}>
            Browse Movies
          </Button>
          {!isAuthenticated && (
            <Button variant="outline" onClick={() => navigate('/login')}>
              Log In
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-6">
        <Button 
          variant="ghost" 
          className="mb-6 text-white"
          onClick={() => navigate(`/movies/${movie._id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to details
        </Button>
        
        <div className="max-w-5xl mx-auto">
          {streamUrl ? (
            <VideoPlayer src={streamUrl} title={movie.title} />
          ) : (
            <div className="aspect-video bg-gray-900 rounded-lg flex flex-col items-center justify-center">
              <Info className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-400 mb-2">Stream not available</p>
              <p className="text-gray-500 text-sm">The video for this movie could not be loaded</p>
            </div>
          )}
          
          <div className="mt-8 bg-gray-900/50 p-6 rounded-lg">
            <h1 className="text-2xl font-bold">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300 mt-2 mb-4">
              <span>{movie.releaseYear}</span>
              <span>•</span>
              <span>{movie.genre}</span>
              <span>•</span>
              <span>{movie.duration} min</span>
            </div>
            <p className="text-gray-400">{movie.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchMoviePage;