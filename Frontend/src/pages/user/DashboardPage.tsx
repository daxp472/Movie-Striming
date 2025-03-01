import { useState } from 'react';
import { FiPlay, FiClock, FiHeart, FiStar } from 'react-icons/fi';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('continue');

  const continueWatching = [
    {
      id: 1,
      title: 'Inception',
      progress: 65,
      thumbnail: 'https://via.placeholder.com/300x169',
      duration: '2h 28m',
      remainingTime: '52m',
    },
    // Add more movies
  ];

  const watchlist = [
    {
      id: 1,
      title: 'The Dark Knight',
      rating: 4.9,
      thumbnail: 'https://via.placeholder.com/300x169',
      duration: '2h 32m',
    },
    // Add more movies
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Interstellar',
      rating: 4.8,
      thumbnail: 'https://via.placeholder.com/300x169',
      genre: 'Sci-Fi',
    },
    // Add more movies
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Welcome back!</h1>

      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['continue', 'watchlist', 'recommended'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm capitalize`}
              >
                {tab === 'continue' ? 'Continue Watching' : tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8">
          {activeTab === 'continue' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {continueWatching.map((movie) => (
                <div key={movie.id} className="group relative">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={movie.thumbnail}
                      alt={movie.title}
                      className="w-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {movie.title}
                    </h3>
                    <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiClock className="mr-1 h-4 w-4" />
                        {movie.remainingTime} left
                      </div>
                      <span>{movie.duration}</span>
                    </div>
                    <div className="mt-2 h-1 w-full rounded-full bg-gray-200">
                      <div
                        className="h-1 rounded-full bg-blue-600"
                        style={{ width: `${movie.progress}%` }}
                      />
                    </div>
                  </div>
                  <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <FiPlay className="h-12 w-12 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {watchlist.map((movie) => (
                <div key={movie.id} className="group relative">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={movie.thumbnail}
                      alt={movie.title}
                      className="w-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {movie.title}
                    </h3>
                    <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiStar className="mr-1 h-4 w-4 text-yellow-400" />
                        {movie.rating}
                      </div>
                      <span>{movie.duration}</span>
                    </div>
                  </div>
                  <button className="absolute top-2 right-2 p-2 bg-white bg-opacity-75 rounded-full">
                    <FiHeart className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recommended' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recommendations.map((movie) => (
                <div key={movie.id} className="group relative">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={movie.thumbnail}
                      alt={movie.title}
                      className="w-full rounded-lg object-cover"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {movie.title}
                    </h3>
                    <div className="mt-1 flex items-center justify-between text-sm text-gray-500">
                      <span>{movie.genre}</span>
                      <div className="flex items-center">
                        <FiStar className="mr-1 h-4 w-4 text-yellow-400" />
                        {movie.rating}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
