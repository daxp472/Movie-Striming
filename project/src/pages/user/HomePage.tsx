import React from 'react';
import FeaturedMovie from '../../components/movies/FeaturedMovie';
import MovieSlider from '../../components/movies/MovieSlider';

// Mock data
const featuredMovie = {
  id: '1',
  title: 'Inception',
  description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
  backdropUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
  genres: ['Sci-Fi', 'Action', 'Thriller'],
  duration: 148,
  rating: 8.8
};

const trendingMovies = [
  {
    id: '1',
    title: 'Inception',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Sci-Fi', 'Action'],
    duration: 148,
    rating: 8.8
  },
  {
    id: '2',
    title: 'The Dark Knight',
    thumbnail: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Action', 'Crime'],
    duration: 152,
    rating: 9.0
  },
  {
    id: '3',
    title: 'Interstellar',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Sci-Fi', 'Adventure'],
    duration: 169,
    rating: 8.6
  },
  {
    id: '4',
    title: 'The Shawshank Redemption',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Drama', 'Crime'],
    duration: 142,
    rating: 9.3
  },
  {
    id: '5',
    title: 'The Godfather',
    thumbnail: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Crime', 'Drama'],
    duration: 175,
    rating: 9.2
  },
  {
    id: '6',
    title: 'Pulp Fiction',
    thumbnail: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Crime', 'Drama'],
    duration: 154,
    rating: 8.9
  }
];

const actionMovies = [
  {
    id: '7',
    title: 'Mad Max: Fury Road',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Action', 'Adventure'],
    duration: 120,
    rating: 8.1
  },
  {
    id: '8',
    title: 'John Wick',
    thumbnail: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Action', 'Thriller'],
    duration: 101,
    rating: 7.4
  },
  {
    id: '9',
    title: 'The Matrix',
    thumbnail: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Action', 'Sci-Fi'],
    duration: 136,
    rating: 8.7
  },
  {
    id: '10',
    title: 'Die Hard',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Action', 'Thriller'],
    duration: 132,
    rating: 8.2
  },
  {
    id: '11',
    title: 'Gladiator',
    thumbnail: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Action', 'Drama'],
    duration: 155,
    rating: 8.5
  },
  {
    id: '12',
    title: 'Mission: Impossible',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Action', 'Adventure'],
    duration: 126,
    rating: 7.1
  }
];

const comedyMovies = [
  {
    id: '13',
    title: 'The Hangover',
    thumbnail: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Comedy'],
    duration: 100,
    rating: 7.7
  },
  {
    id: '14',
    title: 'Superbad',
    thumbnail: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Comedy'],
    duration: 113,
    rating: 7.6
  },
  {
    id: '15',
    title: 'Bridesmaids',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Comedy', 'Romance'],
    duration: 125,
    rating: 6.8
  },
  {
    id: '16',
    title: 'Anchorman',
    thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Comedy'],
    duration: 94,
    rating: 7.2
  },
  {
    id: '17',
    title: 'Step Brothers',
    thumbnail: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Comedy'],
    duration: 98,
    rating: 6.9
  },
  {
    id: '18',
    title: 'The Grand Budapest Hotel',
    thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80',
    genres: ['Comedy', 'Drama'],
    duration: 99,
    rating: 8.1
  }
];

const HomePage: React.FC = () => {
  return (
    <div className="pb-10">
      <FeaturedMovie {...featuredMovie} />
      
      <div className="container mx-auto px-4 mt-8">
        <MovieSlider title="Trending Now" movies={trendingMovies} />
        <MovieSlider title="Action Movies" movies={actionMovies} />
        <MovieSlider title="Comedy Movies" movies={comedyMovies} />
        <MovieSlider title="Recently Added" movies={[...actionMovies, ...comedyMovies].slice(0, 6)} />
      </div>
    </div>
  );
};

export default HomePage;