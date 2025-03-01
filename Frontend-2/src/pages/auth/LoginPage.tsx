// src/pages/auth/LoginPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from 'lucide-react';
import Layout from "../../components/layout/Layout";

function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Add API call here
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <Layout>
      <div className="container flex min-h-screen w-full flex-col items-center justify-center px-4">
        <div className="w-full max-w-md rounded-xl bg-black/40 p-8 backdrop-blur-xl border border-white/10 shadow-xl">
          <div className="flex flex-col space-y-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-sm text-gray-400">
              Enter your credentials to sign in
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-lg bg-white/5 p-3 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg bg-white/5 p-3 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-purple-600 py-3 text-white font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              Sign In
            </button>
          </form>

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
              className="font-medium text-purple-400 hover:text-purple-300 hover:underline"
            >
              Don't have an account? Sign Up
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default LoginPage;