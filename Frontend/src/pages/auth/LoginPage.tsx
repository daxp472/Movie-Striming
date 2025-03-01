import { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";
import { Loader2 } from 'lucide-react';

function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoginStart = (): void => {
    setIsLoading(true);
  };

  const handleLoginEnd = (): void => {
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Gradient background with blur effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-purple-700/30 blur-[100px]"></div>
        <div className="absolute -right-1/4 bottom-0 h-[600px] w-[600px] rounded-full bg-indigo-700/30 blur-[100px]"></div>
        <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] rounded-full bg-fuchsia-700/20 blur-[100px]"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl bg-black/40 p-8 backdrop-blur-xl backdrop-filter sm:p-10 border border-white/10 shadow-xl">
          <div className="flex flex-col space-y-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-sm text-gray-400">
              Enter your credentials to sign in to your account
            </p>
          </div>

          {/* Form Container with inline fields */}
          <div className="mt-8 bg-white/5 rounded-lg p-6 backdrop-blur-md border border-white/10">
            <LoginForm 
              onLoginStart={handleLoginStart} 
              onLoginEnd={handleLoginEnd}
              className="flex flex-col space-y-6"
            />
          </div>

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/60 backdrop-blur-sm">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                <p className="text-sm font-medium text-white">Signing you in...</p>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-gray-400">
            <Link
              to="/register"
              className="font-medium text-purple-400 transition-colors hover:text-purple-300 hover:underline"
            >
              Don't have an account? Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;