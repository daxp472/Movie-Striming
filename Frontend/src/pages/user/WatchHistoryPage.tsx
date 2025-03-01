import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiClock, FiTrash2 } from 'react-icons/fi';
import { movieEndpoints } from '@/config/api';
import { Button } from '@/components/ui/button';

interface HistoryItem {
  _id: string;
  movieId: string;
  progress: number;
  completed: boolean;
  lastWatched: string;
  movie: {
    _id: string;
    title: string;
    thumbnail: string;
    duration: number;
  };
}

export default function WatchHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const response = await movieEndpoints.getWatchHistory();
      setHistory(response.data.history);
    } catch (error) {
      toast.error('Failed to load watch history');
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear your watch history?')) {
      return;
    }

    try {
      await movieEndpoints.clearHistory();
      setHistory([]);
      toast.success('Watch history cleared');
    } catch (error) {
      toast.error('Failed to clear history');
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Watch History</h1>
        {history.length > 0 && (
          <Button
            variant="destructive"
            onClick={clearHistory}
            className="flex items-center gap-2"
          >
            <FiTrash2 />
            Clear History
          </Button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Your watch history is empty</p>
          <p className="text-gray-500">Movies you watch will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Link
              key={item._id}
              to={`/movies/${item.movie._id}`}
              className="flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <img
                src={item.movie.thumbnail}
                alt={item.movie.title}
                className="w-40 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.movie.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiClock />
                    {Math.floor((item.progress / item.movie.duration) * 100)}% watched
                  </span>
                  <span>
                    Last watched: {new Date(item.lastWatched).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
