import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Film, Award, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        {/* Background with overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>
          <div className="absolute inset-0 bg-black/50 z-0"></div>
          <img 
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2225&q=80" 
            alt="Movie Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Navbar */}
        <nav className="relative z-20 px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">Bolt</span>
              <span className="ml-1 text-purple-500 font-bold">Movies</span>
            </div>
            <div className="space-x-4">
              <Link to="/login" className="px-4 py-2 rounded-md text-white hover:text-purple-400 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-white transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
        
        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Unlimited movies, TV shows, and more.</h1>
            <p className="text-xl md:text-2xl mb-8">Watch anywhere. Cancel anytime.</p>
            <Link 
              to="/register" 
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md text-white text-lg font-medium transition-colors"
            >
              <Play className="mr-2" size={20} />
              Get Started
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose Bolt Movies?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <Film size={32} className="text-purple-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">HD Streaming</h3>
              <p className="text-gray-400">Enjoy your favorite movies and shows in stunning high definition quality.</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <Award size={32} className="text-purple-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Content</h3>
              <p className="text-gray-400">Access exclusive premium content not available on other platforms.</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <Users size={32} className="text-purple-500" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Multiple Profiles</h3>
              <p className="text-gray-400">Create up to 5 profiles for different members of your household.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pricing Section */}
      <div className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Choose Your Plan</h2>
          <p className="text-xl text-center text-gray-400 mb-16">Select the perfect plan for your entertainment needs</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold mb-1">Basic Plan</h3>
                <p className="text-gray-400">For individual users</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$7.99</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>720p streaming quality</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Watch on 1 device</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                <Link 
                  to="/register" 
                  className="mt-6 block w-full py-2 text-center bg-purple-600 hover:bg-purple-700 rounded-md text-white transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-purple-500 rounded-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold mb-1">Premium Plan</h3>
                <p className="text-gray-400">For couples and small families</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$12.99</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>1080p streaming quality</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Watch on 2 devices</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Download for offline viewing</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                <Link 
                  to="/register" 
                  className="mt-6 block w-full py-2 text-center bg-purple-600 hover:bg-purple-700 rounded-md text-white transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold mb-1">VIP Plan</h3>
                <p className="text-gray-400">For the whole family</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$18.99</span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>4K + HDR streaming quality</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Watch on 4 devices</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Download for offline viewing</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Exclusive VIP content</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                <Link 
                  to="/register" 
                  className="mt-6 block w-full py-2 text-center bg-purple-600 hover:bg-purple-700 rounded-md text-white transition-colors"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-12 bg-black border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <span className="text-2xl font-bold text-white">Bolt</span>
              <span className="ml-1 text-purple-500 font-bold">Movies</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Bolt Movies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
