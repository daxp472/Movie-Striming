import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { movieEndpoints } from '@/config/api';

interface MoviePlayerProps {
  movieId: string;
  initialProgress?: number;
}

export default function MoviePlayer({ movieId, initialProgress = 0 }: MoviePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const progressInterval = useRef<number>();

  useEffect(() => {
    loadMovie();
    return () => {
      if (progressInterval.current) {
        window.clearInterval(progressInterval.current);
      }
    };
  }, [movieId]);

  const loadMovie = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await movieEndpoints.getStreamUrl(movieId);
      if (videoRef.current) {
        videoRef.current.src = response.data.url;
        videoRef.current.currentTime = initialProgress;
      }
    } catch (error) {
      setError('Failed to load movie. Please try again later.');
      toast.error('Failed to load movie');
    } finally {
      setIsLoading(false);
    }
  };

  const startProgressTracking = () => {
    progressInterval.current = window.setInterval(async () => {
      if (videoRef.current) {
        const progress = Math.floor(videoRef.current.currentTime);
        const duration = Math.floor(videoRef.current.duration);
        const completed = progress / duration >= 0.9; // 90% watched

        try {
          await movieEndpoints.updateProgress(movieId, {
            progress,
            completed,
          });
        } catch (error) {
          console.error('Failed to update progress:', error);
        }
      }
    }, 30000); // Update every 30 seconds
  };

  const handlePlay = () => {
    startProgressTracking();
  };

  const handlePause = () => {
    if (progressInterval.current) {
      window.clearInterval(progressInterval.current);
    }
  };

  if (isLoading) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aspect-video bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={loadMovie}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className="w-full aspect-video bg-black"
      controls
      onPlay={handlePlay}
      onPause={handlePause}
    />
  );
}
