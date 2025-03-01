# Bolt Movie Streaming Platform - Frontend Documentation

## Authentication Flow

### 1. User Registration
```typescript
POST /api/auth/register
Body: {
  email: string,
  password: string,
  name: string
}
Response: {
  message: string,
  userId: string
}
```
- After registration, user receives verification code via email
- User status is set to "pending" until verification

### 2. Email Verification
```typescript
POST /api/auth/verify
Body: {
  email: string,
  code: string
}
Response: {
  message: string,
  token: string
}
```
- Verification code is sent via nodemailer
- Code expires after 10 minutes
- User status changes to "active" after verification

### 3. User Login
```typescript
POST /api/auth/login
Body: {
  email: string,
  password: string
}
Response: {
  token: string,
  user: {
    _id: string,
    name: string,
    email: string,
    role: "user" | "admin",
    status: "pending" | "active" | "blocked"
  }
}
```

## Movie Features

### 1. Browse Movies
```typescript
GET /api/movies
Query: {
  page: number,
  limit: number,
  genre?: string,
  search?: string,
  sort?: "latest" | "popular" | "rating"
}
Response: {
  movies: Movie[],
  totalPages: number,
  currentPage: number
}
```

### 2. Movie Details
```typescript
GET /api/movies/:id
Response: {
  _id: string,
  title: string,
  description: string,
  thumbnail: string,
  videoUrl: string,
  genre: string[],
  duration: number,
  rating: number,
  status: "pending" | "approved" | "rejected",
  createdAt: Date
}
```

### 3. Watch History
```typescript
GET /api/users/history
Response: {
  history: {
    movieId: string,
    watchedAt: Date,
    progress: number
  }[]
}
```

### 4. Watchlist
```typescript
GET /api/users/watchlist
POST /api/users/watchlist/:movieId
DELETE /api/users/watchlist/:movieId
```

### 5. Continue Watching
```typescript
POST /api/users/progress
Body: {
  movieId: string,
  progress: number
}
```

## User Profile
```typescript
GET /api/users/profile
PUT /api/users/profile
Body: {
  name?: string,
  password?: string
}
```

## Implementation Notes

1. Authentication:
   - Use JWT tokens for authentication
   - Store token in localStorage
   - Add Authorization header to all protected requests
   - Handle token expiration and refresh

2. Movie Player:
   - Only show play button for approved movies
   - Save watching progress every 30 seconds
   - Resume from last watched position
   - Show loading state while video buffers

3. Error Handling:
   - Show toast notifications for errors
   - Redirect to login on 401 errors
   - Show friendly error messages
   - Add retry mechanism for failed requests

4. UI Components:
   - Loading skeletons for data fetching
   - Infinite scroll for movie lists
   - Responsive grid layout
   - Modal dialogs for forms
   - Toast notifications for feedback
