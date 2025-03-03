import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center bg-black/30 p-8 rounded-2xl border border-white/20 backdrop-blur-md shadow-lg">
          <h2 className="text-3xl font-bold text-white drop-shadow-md mb-4">
            You need to be logged in
          </h2>
          <p className="text-gray-300 font-light mb-6">
            Please log in to view your profile.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="rounded-xl bg-purple-600 text-white font-medium py-3 px-6 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
          >
            Log In
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md mb-8">
          Your Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Account Information Card */}
          <div className="md:col-span-1">
            <Card className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-black/50">
              <CardHeader>
                <CardTitle className="text-white text-xl font-semibold drop-shadow-md">
                  Account Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your personal details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-3">
                  <User className="h-6 w-6 text-purple-400 drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]" />
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="font-medium text-white">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-6 w-6 text-purple-400 drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium text-white">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-6 w-6 text-purple-400 drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]" />
                  <div>
                    <p className="text-sm text-gray-400">Joined</p>
                    <p className="font-medium text-white">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-purple-400 drop-shadow-[0_0_4px_rgba(168,85,247,0.6)]" />
                  <div>
                    <p className="text-sm text-gray-400">Role</p>
                    <p className="font-medium text-white capitalize">{user.role}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-6 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-purple-500/20 transition-all duration-300"
                  onClick={() => logout()}
                >
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Streaming Status Card */}
          <div className="md:col-span-2">
            <Card className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-black/50">
              <CardHeader>
                <CardTitle className="text-white text-xl font-semibold drop-shadow-md">
                  Streaming Status
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your current streaming permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user.isApproved ? (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-300 px-4 py-3 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="h-5 w-5 text-green-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium">
                          Your account is approved for streaming
                        </p>
                        <p className="mt-2 text-sm font-light">
                          You can watch all available movies in our library.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 px-4 py-3 rounded-xl backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <svg
                        className="h-5 w-5 text-yellow-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium">
                          Your account is pending approval
                        </p>
                        <p className="mt-2 text-sm font-light">
                          An administrator needs to approve your account before you can stream
                          movies. You can still browse the movie catalog while you wait.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="text-lg font-medium text-white drop-shadow-md">
                    What you can do:
                  </h3>
                  <ul className="mt-2 space-y-3 text-sm text-gray-300">
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Browse all movies in our catalog
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-5 w-5 text-green-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      View movie details and information
                    </li>
                    <li className="flex items-center">
                      {user.isApproved ? (
                        <>
                          <svg
                            className="h-5 w-5 text-green-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Stream movies from our library
                        </>
                      ) : (
                        <>
                          <svg
                            className="h-5 w-5 text-red-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Stream movies (requires approval)
                        </>
                      )}
                    </li>
                  </ul>
                </div>

                <Button
                  className="mt-6 rounded-xl bg-purple-600 text-white font-medium py-3 px-6 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                  onClick={() => navigate('/movies')}
                >
                  Browse Movies
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;