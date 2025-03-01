# Movie Features API

A comprehensive API for user movie features including browsing, watch history tracking, watchlist management, progress tracking, user preferences, and movie recommendations.

## Features

### Core Features
- Movie browsing with filters and search
- Watch history tracking
- Watchlist management
- Progress tracking
- User preferences
- Movie recommendations

## API Documentation

### Authentication

#### Register a new user
```
POST /api/auth/register
```
Body:
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
```
Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get User Profile
```
GET /api/auth/profile
```
Header: `Authorization: Bearer {token}`

#### Update Profile
```
PUT /api/auth/profile
```
Header: `Authorization: Bearer {token}`
Body:
```json
{
  "username": "newUsername",
  "email": "newemail@example.com"
}
```

#### Change Password
```
POST /api/auth/change-password
```
Header: `Authorization: Bearer {token}`
Body:
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword"
}
```

### Movie Management

#### Get Movies List
```
GET /api/movies
```
Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `genre`: Filter by genre(s)
- `search`: Search term
- `sort`: Sort by "latest", "popular", or "rating"

#### Get Movie Details
```
GET /api/movies/:id
```

#### Get Movie Stream
```
GET /api/movies/:id/stream
```
Header: `Authorization: Bearer {token}`

#### Update Movie Progress
```
POST /api/movies/:id/progress
```
Header: `Authorization: Bearer {token}`
Body:
```json
{
  "progress": 120,
  "completed": false
}
```

#### Get Recommended Movies
```
GET /api/movies/recommendations/list
```
Header: `Authorization: Bearer {token}`
Query Parameters:
- `limit`: Number of recommendations (default: 10)

### Watch History

#### Get Watch History
```
GET /api/history
```
Header: `Authorization: Bearer {token}`
Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort by "recent" or "mostWatched"

#### Add to History
```
POST /api/history
```
Header: `Authorization: Bearer {token}`
Body:
```json
{
  "movieId": "movie_id_here",
  "progress": 120,
  "completed": false
}
```

#### Clear History
```
DELETE /api/history
```
Header: `Authorization: Bearer {token}`

#### Remove from History
```
DELETE /api/history/:movieId
```
Header: `Authorization: Bearer {token}`

### Watchlist

#### Get Watchlist
```
GET /api/watchlist
```
Header: `Authorization: Bearer {token}`
Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### Add to Watchlist
```
POST /api/watchlist/:movieId
```
Header: `Authorization: Bearer {token}`

#### Remove from Watchlist
```
DELETE /api/watchlist/:movieId
```
Header: `Authorization: Bearer {token}`

#### Check if Movie is in Watchlist
```
GET /api/watchlist/:movieId/check
```
Header: `Authorization: Bearer {token}`

### User Preferences

#### Get Preferences
```
GET /api/preferences
```
Header: `Authorization: Bearer {token}`

#### Update Preferences
```
PUT /api/preferences
```
Header: `Authorization: Bearer {token}`
Body:
```json
{
  "preferredGenres": ["action", "comedy"],
  "language": "en",
  "subtitles": true,
  "autoplay": true,
  "notifications": true
}
```

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and update the values
4. Start the server:
   ```
   npm run dev
   ```

## Testing

Run tests with:
```
npm test
```

## Performance Considerations

- Indexes on frequently queried fields
- Caching for movie lists and recommendations
- Pagination for all list endpoints
- Optimized video streaming

## Security Features

- JWT authentication
- Rate limiting on API endpoints
- Validation of user ownership of records
- Input sanitization