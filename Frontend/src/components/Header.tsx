import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FiSearch, FiBell, FiUser, FiLogOut } from "react-icons/fi";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-black/40 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white">
              Chill-Stream
            </Link>
            {user && (
              <nav className="ml-10 hidden space-x-8 md:flex">
                <Link
                  to="/movies"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                >
                  Movies
                </Link>
                <Link
                  to="/series"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                >
                  Series
                </Link>
                <Link
                  to="/watchlist"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                >
                  Watchlist
                </Link>
              </nav>
            )}
          </div>

          {user ? (
            <div className="flex items-center space-x-6">
              <button className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                <FiSearch className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-purple-400 transition-colors duration-200">
                <FiBell className="h-6 w-6" />
              </button>
              <div className="relative">
                <button className="flex items-center space-x-3 text-white hover:text-purple-400 transition-colors duration-200">
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-black/80 py-1 shadow-lg ring-1 ring-white/10 backdrop-blur-md">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors duration-200"
                  >
                    Profile
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors duration-200"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-purple-400 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <FiLogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;