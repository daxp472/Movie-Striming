import { FiEye, FiStar } from 'react-icons/fi';

const PopularMovies = () => {
  const movies = [
    {
      title: 'Inception',
      views: '125K',
      rating: 4.8,
      thumbnail: 'https://via.placeholder.com/150',
    },
    {
      title: 'The Dark Knight',
      views: '98K',
      rating: 4.9,
      thumbnail: 'https://via.placeholder.com/150',
    },
    {
      title: 'Interstellar',
      views: '87K',
      rating: 4.7,
      thumbnail: 'https://via.placeholder.com/150',
    },
    {
      title: 'The Matrix',
      views: '76K',
      rating: 4.6,
      thumbnail: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Popular Movies</h3>
      <div className="mt-6 flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {movies.map((movie, index) => (
            <li key={index} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-lg object-cover"
                    src={movie.thumbnail}
                    alt={movie.title}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {movie.title}
                  </p>
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiEye className="mr-1 h-4 w-4" />
                      {movie.views}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiStar className="mr-1 h-4 w-4 text-yellow-400" />
                      {movie.rating}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
          View all movies
        </button>
      </div>
    </div>
  );
};

export default PopularMovies;
