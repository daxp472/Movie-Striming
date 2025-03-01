import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AdminMoviesPage from './pages/admin/AdminMoviesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminAddMoviePage from './pages/admin/AdminAddMoviePage';
import AdminEditMoviePage from './pages/admin/AdminEditMoviePage';

// Layout Components
import AuthLayout from './components/layouts/AuthLayout';
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Auth Provider
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/activate" element={<ActivationPage />} />
          </Route>

          {/* User Routes */}
          <Route element={<UserLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/watch/:id" element={<WatchPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/preferences" element={<PreferencesPage />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/movies" element={<AdminMoviesPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/movies/add" element={<AdminAddMoviePage />} />
            <Route path="/admin/movies/edit/:id" element={<AdminEditMoviePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;