const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/index');
const Movie = require('../src/models/movie.model');
const User = require('../src/models/user.model');
const jwt = require('jsonwebtoken');

describe('Movie API', () => {
  let token;
  let userId;
  let movieId;

  beforeAll(async () => {
    // Create a test user
    const user = await User.create({
      username: 'movieuser',
      email: 'movie@example.com',
      password: 'password123'
    });
    
    userId = user._id;
    
    // Generate token
    token = jwt.sign(
      { id: userId, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Create a test movie
    const movie = await Movie.create({
      title: 'Test Movie',
      description: 'A test movie description',
      thumbnail: 'https://example.com/thumbnail.jpg',
      videoUrl: 'https://example.com/movie.mp4',
      genre: ['action', 'drama'],
      duration: 7200,
      rating: 8.5,
      views: 100,
      status: 'approved'
    });
    
    movieId = movie._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Movie.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /api/movies', () => {
    it('should get a list of movies', async () => {
      const res = await request(app)
        .get('/api/movies');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('movies');
      expect(Array.isArray(res.body.data.movies)).toBeTruthy();
    });

    it('should filter movies by genre', async () => {
      const res = await request(app)
        .get('/api/movies?genre=action');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.data.movies.length).toBeGreaterThan(0);
      expect(res.body.data.movies[0].genre).toContain('action');
    });
  });

  describe('GET /api/movies/:id', () => {
    it('should get a movie by id', async () => {
      const res = await request(app)
        .get(`/api/movies/${movieId}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data.movie).toHaveProperty('title', 'Test Movie');
    });

    it('should return 404 for non-existent movie', async () => {
      const res = await request(app)
        .get(`/api/movies/${new mongoose.Types.ObjectId()}`);
      
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('GET /api/movies/:id/stream', () => {
    it('should require authentication', async () => {
      const res = await request(app)
        .get(`/api/movies/${movieId}/stream`);
      
      expect(res.statusCode).toEqual(401);
    });

    it('should get stream URL with authentication', async () => {
      const res = await request(app)
        .get(`/api/movies/${movieId}/stream`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('streamUrl');
    });
  });

  // More movie tests can be added here
});