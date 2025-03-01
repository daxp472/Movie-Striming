// src/pages/user/MoviesPage.tsx
import { useState } from 'react';
import Layout from '../../components/layout/Layout';

function MoviesPage() {
  const [search, setSearch] = useState('');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Movies</h1>
          <div className="mt-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search movies..."
              className="w-full max-w-md rounded-lg bg-white/5 p-3 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Movie cards would go here */}
        </div>
      </div>
    </Layout>
  );
}

export default MoviesPage;