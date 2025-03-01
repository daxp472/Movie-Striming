import { useState } from 'react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import MovieGrid from '@/components/movies/MovieGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const genres = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Romance',
  'Thriller',
  'Sci-Fi',
];

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
];

const movies = [
  {
    id: 1,
    title: 'Inception',
    genre: 'sci-fi',
    rating: 4.8,
    thumbnail: 'https://via.placeholder.com/300x450',
    year: 2010,
  },
  // Add more movies
];

const filteredMovies = movies.filter(
  (movie) =>
    (selectedGenre === '' || movie.genre === selectedGenre) &&
    movie.title.toLowerCase().includes(search.toLowerCase())
);

export default function MoviesPage() {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sort, setSort] = useState('latest');

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <h1 className="text-3xl font-bold">Movies</h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre.toLowerCase()}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="group">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              <img
                src={movie.thumbnail}
                alt={movie.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-medium">{movie.title}</h3>
                  <p className="text-gray-300 text-sm">
                    {movie.year} • {movie.genre}
                  </p>
                  <div className="mt-2">
                    <Button className="bg-white text-gray-900 px-4 py-1 rounded-md text-sm font-medium hover:bg-gray-100">
                      Watch Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
