import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }

    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      await register(name, email, password);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative max-w-md w-full space-y-8 bg-black/30 p-8 rounded-2xl shadow-2xl shadow-black/50 border border-white/20 backdrop-blur-xl">
        {/* Glassmorphism Card */}
        <div className="text-center">
          <div className="flex justify-center">
            <Film className="h-12 w-12 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
          </div>
          <h2 className="mt-6 text-4xl font-bold text-white tracking-tight drop-shadow-md">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-300 font-light">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors duration-200"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-gray-200 font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-gray-200 font-medium">
                Email address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-200 font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 focus:border-transparent transition-all duration-300"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-gray-200 font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2 w-full rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 focus:border-transparent transition-all duration-300"
              />
              {passwordError && (
                <p className="text-sm text-red-400 mt-2 drop-shadow-sm">{passwordError}</p>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-300 font-light">
            <p>By registering, you’ll need admin approval before you can stream movies.</p>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl bg-purple-600 text-white font-medium py-3 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Film className="h-5 w-5 animate-spin mr-2" />
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;