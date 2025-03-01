import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiSearch, FiBell, FiUser, FiLogOut } from 'react-icons/fi';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Bolt
            </Link>
            {user && (
              <nav className="ml-10 hidden space-x-8 md:flex">
                <Link
                  to="/movies"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Movies
                </Link>
                <Link
                  to="/series"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Series
                </Link>
                <Link
                  to="/watchlist"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Watchlist
                </Link>
              </nav>
            )}
          </div>

          {user ? (
            <div className="flex items-center space-x-6">
              <button className="text-gray-400 hover:text-gray-500">
                <FiSearch className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-gray-500">
                <FiBell className="h-6 w-6" />
              </button>
              <div className="relative">
                <button className="flex items-center space-x-3 text-gray-700 hover:text-gray-900">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <FiUser className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
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
                className="text-gray-500 hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
