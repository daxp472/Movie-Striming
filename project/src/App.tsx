import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ActivationPage from './pages/auth/ActivationPage';

// User Pages
import HomePage from './pages/user/HomePage';
import MovieDetailsPage from './pages/user/MovieDetailsPage';
import WatchPage from './pages/user/WatchPage';
import WatchlistPage from './pages/user/WatchlistPage';
import HistoryPage from './pages/user/HistoryPage';
import ProfilePage from './pages/user/ProfilePage';
import PreferencesPage from './pages/user/PreferencesPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Movies from './pages/admin/Movies';
import Users from './pages/admin/Users';
import AddMovie from './pages/admin/AddMovie';
import Analytics from './pages/admin/Analytics';

// Layout Components
import AuthLayout from './components/layouts/AuthLayout';
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Landing Page
import LandingPage from './pages/LandingPage';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-center" />
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/activate" element={<ActivationPage />} />
            </Route>

            {/* User Routes */}
            {/* <Route element={<UserLayout />}> */}
              <Route path="/home" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              <Route path="/watch/:id" element={<WatchPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/preferences" element={<PreferencesPage />} />
              <Route path="/movies" element={<HomePage />} />
              <Route path="/tv-shows" element={<HomePage />} />
              <Route path="/trending" element={<HomePage />} />
              <Route path="/favorites" element={<HomePage />} />
              <Route path="/settings" element={<PreferencesPage />} />
            {/* </Route> */}

            {/* Admin Routes */}
            {/* <Route element={<AdminLayout />}> */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/movies" element={<Movies />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/movies/add" element={<AddMovie />} />
              <Route path="/admin/analytics" element={<Analytics />} />
            {/* </Route> */}

            {/* Redirect legacy root to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;