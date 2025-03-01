import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster as HotToaster } from 'react-hot-toast';
import Header from './components/Header';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyPage from './pages/auth/VerifyPage';
import DashboardPage from './pages/user/DashboardPage';
import ProfilePage from './pages/user/ProfilePage';
import MoviesPage from './pages/user/MoviesPage';
import MovieDetailsPage from './pages/user/MovieDetailsPage';
import WatchlistPage from './pages/user/WatchlistPage';
import WatchHistoryPage from './pages/user/WatchHistoryPage';
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import MovieManagement from './pages/admin/MovieManagement';
import AddMovie from './pages/admin/AddMovie';
import EditMovie from './pages/admin/EditMovie';
import UserManagement from './pages/admin/UserManagement';
import Analytics from './pages/admin/Analytics';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        
        {/* User Routes */}
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/history" element={<WatchHistoryPage />} />
        </Route>

        {/* Admin Routes */}
        {/* <Route element={<ProtectedRoute role="admin" />}> */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="movies" element={<MovieManagement />} /> 
            <Route path="movies/add" element={<AddMovie />} />
            <Route path="movies/edit/:id" element={<EditMovie />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
        {/* </Route> */}

        <Route path="/" element={<Navigate to="/movies" replace />} />
      </Routes>
      <HotToaster />
    </>
  );
}

export default App;