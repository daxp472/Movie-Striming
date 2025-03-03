import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10); // Change at 10px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`border-b sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-transparent backdrop-blur-md border-white/20 shadow-lg shadow-black/50'
          : 'bg-black border-gray-800'
      }`}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <Film
            className={`h-7 w-7 ${
              isScrolled ? 'text-purple-400 group-hover:text-purple-300' : 'text-white'
            } transition-colors duration-300 drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]`}
          />
          <span
            className={`font-bold text-2xl ${
              isScrolled ? 'text-white group-hover:text-purple-300' : 'text-white'
            } transition-colors duration-300 drop-shadow-md`}
          >
            MovieStream
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`text-sm font-medium ${
              isScrolled ? 'text-gray-300 hover:text-purple-400' : 'text-gray-300 hover:text-white'
            } hover:underline underline-offset-4 transition-all duration-200`}
          >
            Home
          </Link>
          <Link
            to="/movies"
            className={`text-sm font-medium ${
              isScrolled ? 'text-gray-300 hover:text-purple-400' : 'text-gray-300 hover:text-white'
            } hover:underline underline-offset-4 transition-all duration-200`}
          >
            Movies
          </Link>
          {user?.role === 'admin' && (
            <Link
              to="/admin"
              className={`text-sm font-medium ${
                isScrolled ? 'text-gray-300 hover:text-purple-400' : 'text-gray-300 hover:text-white'
              } hover:underline underline-offset-4 transition-all duration-200`}
            >
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`relative h-10 w-10 rounded-full ${
                    isScrolled
                      ? 'bg-white/10 border border-white/20 hover:bg-white/20'
                      : 'bg-gray-800 border border-gray-700 hover:bg-gray-700'
                  } transition-all duration-300`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback
                      className={`${
                        isScrolled ? 'bg-purple-600/20 text-white font-medium' : 'bg-gray-600 text-white'
                      }`}
                    >
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={`w-56 ${
                  isScrolled
                    ? 'bg-black/80 border border-white/20 text-white backdrop-blur-md rounded-xl shadow-lg'
                    : 'bg-gray-800 border border-gray-700 text-white'
                }`}
                align="end"
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-3">
                  <div className="flex flex-col space-y-1">
                    <p
                      className={`text-sm font-medium leading-none ${
                        isScrolled ? 'text-white drop-shadow-sm' : 'text-white'
                      }`}
                    >
                      {user?.name}
                    </p>
                    <p
                      className={`text-xs leading-none ${
                        isScrolled ? 'text-gray-400' : 'text-gray-400'
                      }`}
                    >
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator
                  className={`${isScrolled ? 'bg-white/10' : 'bg-gray-600'}`}
                />
                <DropdownMenuItem
                  onClick={() => navigate('/profile')}
                  className={`flex items-center px-3 py-2 ${
                    isScrolled
                      ? 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 focus:bg-purple-600/30'
                      : 'text-gray-300 hover:bg-gray-700 focus:bg-gray-700'
                  } transition-colors duration-200`}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {user?.role === 'admin' && (
                  <DropdownMenuItem
                    onClick={() => navigate('/admin')}
                    className={`flex items-center px-3 py-2 ${
                      isScrolled
                        ? 'text-gray-300 hover:bg-purple-600/20 hover:text-purple-300 focus:bg-purple-600/30'
                        : 'text-gray-300 hover:bg-gray-700 focus:bg-gray-700'
                    } transition-colors duration-200`}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin Dashboard</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator
                  className={`${isScrolled ? 'bg-white/10' : 'bg-gray-600'}`}
                />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className={`flex items-center px-3 py-2 ${
                    isScrolled
                      ? 'text-gray-300 hover:bg-red-500/20 hover:text-red-300 focus:bg-red-500/30'
                      : 'text-gray-300 hover:bg-gray-700 focus:bg-gray-700'
                  } transition-colors duration-200`}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className={`text-sm ${
                  isScrolled
                    ? 'text-gray-300 hover:text-purple-400 hover:bg-white/10 border border-white/20'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700'
                } rounded-xl transition-all duration-300 px-4 py-2`}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate('/register')}
                className={`rounded-xl font-medium px-4 py-2 ${
                  isScrolled
                    ? 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                } transition-all duration-300`}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;