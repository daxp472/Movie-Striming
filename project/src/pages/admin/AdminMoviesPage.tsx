import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminMoviesPage: React.FC = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/movies', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
          }
        });
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Movies</h1>
      <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <ul>
          {movies.map((movie, index) => (
            <li key={index} className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-white">{movie.title}</span>
              <span className="text-gray-400">{movie.releaseDate}</span>
              <span className="text-yellow-400">{movie.genres.join(', ')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminMoviesPage;