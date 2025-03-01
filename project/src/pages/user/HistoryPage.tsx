import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Trash2, Clock } from 'lucide-react';

// Mock data
const historyItems = [
  {
    id: '1',
    title: 'Inception',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Sci-Fi', 'Action'],
    duration: 148,
    progress: 75, // percentage
    lastWatched: '2023-12-20T14:30:00Z'
  },
  {
    id: '2',
    title: 'The Dark Knight',
    thumbnail: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Action', 'Crime'],
    duration: 152,
    progress: 100, // completed
    lastWatched: '2023-12-18T20:15:00Z'
  },
  {
    id: '3',
    title: 'Interstellar',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Sci-Fi', 'Adventure'],
    duration: 169,
    progress: 30,
    lastWatched: '2023-12-15T19:45:00Z'
  },
  {
    id: '4',
    title: 'The Shawshank Redemption',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Drama', 'Crime'],
    duration: 142,
    progress: 100,
    lastWatched: '2023-12-10T21:30:00Z'
  }
];

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState(historyItems);

  const removeFromHistory = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Watch History</h1>
          <p className="text-gray-400">Movies and shows you've watched</p>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20"
          >
            <Trash2 size={16} />
            <span>Clear History</span>
          </button>
        )}
      </div>
      
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row bg-black/40 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="sm:w-48 md:w-64 relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 sm:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="flex items-center justify-between text-white text-sm">
                    <span>{Math.floor(item.duration / 60)}h {item.duration % 60}m</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="mt-1 h-1 w-full bg-white/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.progress === 100 ? 'bg-green-500' : 'bg-purple-600'}`}
                      style={{ width: `${item.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-white mb-1">{item.title}</h3>
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <span>{item.genres.join(', ')}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(item.lastWatched)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock size={14} className="mr-1" />
                    <span>
                      {item.progress === 100 
                        ? 'Completed' 
                        : `${Math.floor((item.progress / 100) * item.duration)} minutes watched`}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <Link
                    to={`/watch/${item.id}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700"
                  >
                    <Play size={16} fill="white" />
                    <span>{item.progress === 100 ? 'Watch Again' : 'Continue'}</span>
                  </Link>
                  
                  <button
                    onClick={() => removeFromHistory(item.id)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
          <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Clock className="h-12 w-12 text-gray-500" />
          </div>
          <h2 className="text-xl font-medium text-white mb-2">Your watch history is empty</h2>
          <p className="text-gray-400 text-center max-w-md mb-6">
            Movies and shows you watch will appear here so you can easily pick up where you left off.
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

export default HistoryPage;