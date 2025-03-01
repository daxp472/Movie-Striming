import { FiUsers, FiFilm, FiEye, FiStar, FiTrendingUp, FiTrendingDown, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      icon: FiUsers,
      change: "+12%",
      trend: "up",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Total Movies",
      value: "567",
      icon: FiFilm,
      change: "+7%",
      trend: "up",
      color: "from-purple-500 to-pink-600",
    },
    {
      title: "Total Views",
      value: "45.2K",
      icon: FiEye,
      change: "+22%",
      trend: "up",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Avg Rating",
      value: "4.8",
      icon: FiStar,
      change: "+3%",
      trend: "up",
      color: "from-yellow-500 to-amber-600",
    },
  ];

  const recentActivities = [
    { user: "John Doe", action: "signed up", time: "2 hours ago" },
    { user: "Jane Smith", action: "watched Inception", time: "3 hours ago" },
    { user: "Mike Johnson", action: "added 3 movies to watchlist", time: "5 hours ago" },
    { user: "Sarah Williams", action: "left a review", time: "1 day ago" },
    { user: "David Brown", action: "subscribed to Premium", time: "1 day ago" },
  ];

  const popularMovies = [
    { title: "Inception", views: "12.5K", rating: 4.8, trend: "up" },
    { title: "The Dark Knight", views: "10.2K", rating: 4.9, trend: "up" },
    { title: "Interstellar", views: "9.8K", rating: 4.7, trend: "down" },
    { title: "Pulp Fiction", views: "8.5K", rating: 4.8, trend: "up" },
    { title: "The Godfather", views: "7.9K", rating: 4.9, trend: "down" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Gradient background with blur effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-purple-700/30 blur-[100px]"></div>
        <div className="absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-indigo-700/30 blur-[100px]"></div>
        <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-fuchsia-700/20 blur-[100px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-6 space-y-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Dashboard Overview
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? FiTrendingUp : FiTrendingDown;
            return (
              <div
                key={index}
                className="rounded-lg bg-gray-800/50 p-6 backdrop-blur-sm border border-gray-700 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20"></div>
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md bg-gradient-to-br ${stat.color} p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendIcon className={`mr-1 h-4 w-4 ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`} />
                  <span className={`font-medium ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                    {stat.change}
                  </span>
                  <span className="ml-2 text-gray-400">from last month</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-gray-800/50 p-6 backdrop-blur-sm border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Recent Activities</h3>
              <Link to="/admin/activities" className="text-sm text-purple-400 hover:text-purple-300">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium">{activity.user.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-gray-800/50 p-6 backdrop-blur-sm border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Popular Movies</h3>
              <Link to="/admin/movies" className="text-sm text-purple-400 hover:text-purple-300">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                    <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Views</th>
                    <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rating</th>
                    <th className="py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {popularMovies.map((movie, index) => (
                    <tr key={index}>
                      <td className="py-3 text-sm font-medium text-white">{movie.title}</td>
                      <td className="py-3 text-sm text-gray-300">{movie.views}</td>
                      <td className="py-3 text-sm">
                        <div className="flex items-center">
                          <FiStar className="mr-1 h-4 w-4 text-yellow-400" />
                          <span className="text-gray-300">{movie.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm">
                        {movie.trend === "up" ? (
                          <FiArrowUp className="h-4 w-4 text-green-400" />
                        ) : (
                          <FiArrowDown className="h-4 w-4 text-red-400" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;