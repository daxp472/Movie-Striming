# Movie Management API Documentation

## Overview
This API provides endpoints for managing movies in an admin-only system. All movie metadata is stored in MongoDB while media files (thumbnails, videos, subtitles, and audio tracks) are distributed across multiple Cloudinary accounts for optimal resource management.

## Base URL
```
http://localhost:3000
```

## Authentication
All endpoints require admin authentication using JWT token.

**Header Format:**
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### 1. Movie Management

#### Create Movie
Upload a new movie with metadata and media files.

**Endpoint:** `POST /movies`  
**Authentication:** Required (Admin only)  
**Content-Type:** `multipart/form-data`

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| title | string | Yes | Movie title |
| description | string | Yes | Movie description/plot |
| releaseDate | string | Yes | Release date (YYYY-MM-DD format) |
| duration | number | Yes | Movie duration in minutes |
| languages | array | Yes | Array of available languages |
| genres | array | Yes | Array of genres (from predefined list) |
| trailerUrl | string | Yes | YouTube trailer URL |
| cloudinaryAccountId | string | Yes | Cloudinary account number (1-5) |
| isSeries | boolean | Yes | Whether this is a series episode |
| seasonNumber | number | If series | Season number for series |
| episodeNumber | number | If series | Episode number for series |
| seriesId | string | If series | ID of the parent series |
| thumbnail | file | Yes | Movie poster/thumbnail image |
| video | file | Yes | Movie video file |
| subtitles | file[] | No | Subtitle files (max 10) |
| audioTracks | file[] | No | Audio track files (max 5) |

**Valid Genres:**
- Action
- Adventure
- Comedy
- Drama
- Fantasy
- Horror
- Mystery
- Romance
- Sci-Fi
- Thriller
- Western

**Example Request:**
```javascript
const formData = new FormData();
formData.append('title', 'Inception');
formData.append('description', 'A mind-bending thriller...');
formData.append('releaseDate', '2010-07-16');
formData.append('duration', 148);
formData.append('languages', JSON.stringify(['English', 'Hindi']));
formData.append('genres', JSON.stringify(['Sci-Fi', 'Action', 'Thriller']));
formData.append('trailerUrl', 'https://www.youtube.com/watch?v=YoHD9XEInc0');
formData.append('cloudinaryAccountId', '1');
formData.append('isSeries', 'false');
formData.append('thumbnail', thumbnailFile);
formData.append('video', videoFile);

// Optional: Add subtitles
formData.append('subtitles', englishSubtitle);
formData.append('subtitles', spanishSubtitle);

// Optional: Add audio tracks
formData.append('audioTracks', englishAudio);
formData.append('audioTracks', hindiAudio);
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Movie created successfully",
  "data": {
    "_id": "123",
    "title": "Inception",
    "description": "A mind-bending thriller...",
    "releaseDate": "2010-07-16T00:00:00.000Z",
    "duration": 148,
    "languages": ["English", "Hindi"],
    "genres": ["Sci-Fi", "Action", "Thriller"],
    "trailerUrl": "https://www.youtube.com/watch?v=YoHD9XEInc0",
    "quality": {
      "480p": "https://res.cloudinary.com/...",
      "720p": "https://res.cloudinary.com/...",
      "1080p": "https://res.cloudinary.com/..."
    },
    "cloudinaryIds": {
      "accountId": "1",
      "videoId": "movies/abc123",
      "thumbnailId": "thumbnails/xyz789"
    },
    "subtitles": [
      {
        "language": "English",
        "url": "https://res.cloudinary.com/..."
      },
      {
        "language": "Spanish",
        "url": "https://res.cloudinary.com/..."
      }
    ],
    "audioTracks": [
      {
        "language": "English",
        "url": "https://res.cloudinary.com/..."
      },
      {
        "language": "Hindi",
        "url": "https://res.cloudinary.com/..."
      }
    ],
    "analytics": {
      "views": 0,
      "ratings": [],
      "averageRating": 0
    },
    "isSeries": false,
    "createdAt": "2023-12-20T10:00:00.000Z",
    "updatedAt": "2023-12-20T10:00:00.000Z"
  }
}
```

#### Update Movie
Update movie details including metadata and media files.

**Endpoint:** `PUT /movies/:id`  
**Authentication:** Required (Admin only)  
**Content-Type:** `multipart/form-data`

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Movie ID (in URL) |
| title | string | No | Movie title |
| description | string | No | Movie description/plot |
| releaseDate | string | No | Release date (YYYY-MM-DD format) |
| duration | number | No | Movie duration in minutes |
| languages | array | No | Array of available languages |
| genres | array | No | Array of genres |
| trailerUrl | string | No | YouTube trailer URL |
| thumbnail | file | No | New thumbnail image |

#### Delete Movie
Delete a movie and its associated media files.

**Endpoint:** `DELETE /movies/:id`  
**Authentication:** Required (Admin only)

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Movie ID (in URL) |

### 2. Series Management

#### Upload Series Batch
Upload multiple episodes for a series at once.

**Endpoint:** `POST /movies/series-batch`  
**Authentication:** Required (Admin only)  
**Content-Type:** `multipart/form-data`

**Request Parameters:**
```json
{
  "seriesInfo": {
    "title": "Series Title",
    "description": "Series description",
    "seasonNumber": 1
  },
  "episodes": [
    {
      "episodeNumber": 1,
      "video": File,
      "thumbnail": File,
      "duration": 45
    },
    // ... more episodes
  ]
}
```

### 3. User Management

#### Get All Users
Retrieve users with optional filters.

**Endpoint:** `GET /users`  
**Authentication:** Required (Admin only)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| status | string | Filter by status (active/suspended/banned) |
| tier | string | Filter by tier (basic/premium/vip) |
| page | number | Page number for pagination |
| limit | number | Items per page |

#### Update User Status
Change a user's status.

**Endpoint:** `PUT /users/:id/status`  
**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "status": "active|suspended|banned",
  "reason": "Reason for status change"
}
```

#### Update User Tier
Change a user's subscription tier.

**Endpoint:** `PUT /users/:id/tier`  
**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "tier": "basic|premium|vip",
  "validUntil": "2024-12-31T23:59:59Z"
}
```

#### Get User Activity
Retrieve user activity logs.

**Endpoint:** `GET /users/:id/activity`  
**Authentication:** Required (Admin only)

#### Handle User Complaints
Manage user complaints.

**Endpoint:** `POST /users/:id/complaints`  
**Authentication:** Required (Admin only)

**Request Body:**
```json
{
  "subject": "Complaint subject",
  "description": "Detailed description"
}
```

## Error Responses

### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "msg": "Invalid value",
        "param": "duration",
        "location": "body"
      }
    ]
  }
}
```

### Authentication Error (401 Unauthorized)
```json
{
  "success": false,
  "message": "Authentication required",
  "error": {
    "code": "AUTH_REQUIRED"
  }
}
```

### Authorization Error (403 Forbidden)
```json
{
  "success": false,
  "message": "Admin access required",
  "error": {
    "code": "ADMIN_REQUIRED"
  }
}
```

### Not Found Error (404 Not Found)
```json
{
  "success": false,
  "message": "Resource not found",
  "error": {
    "code": "NOT_FOUND",
    "details": "Requested resource does not exist"
  }
}
```

### Server Error (500 Internal Server Error)
```json
{
  "success": false,
  "message": "Internal server error",
  "error": {
    "code": "SERVER_ERROR",
    "details": "An unexpected error occurred"
  }
}
```

## Data Models

### Movie Schema
```typescript
interface Movie {
  _id: string;                // Unique identifier for the movie
  title: string;              // Movie title
  description: string;        // Movie description/plot
  releaseDate: Date;         // Release date of the movie
  duration: number;          // Duration in minutes
  languages: string[];       // Available audio languages
  genres: string[];         // Movie genres from predefined list
  trailerUrl: string;       // YouTube trailer URL
  quality: {                // Different video quality URLs
    '480p': string;        // SD quality stream URL
    '720p': string;        // HD quality stream URL
    '1080p': string;       // Full HD quality stream URL
  };
  cloudinaryIds: {          // Cloudinary resource identifiers
    accountId: string;      // Which Cloudinary account (1-5)
    videoId: string;        // Video resource ID
    thumbnailId: string;    // Thumbnail resource ID
  };
  subtitles: Array<{        // Available subtitle tracks
    language: string;       // Subtitle language
    url: string;           // Subtitle file URL
  }>;
  audioTracks: Array<{      // Available audio tracks
    language: string;       // Audio track language
    url: string;           // Audio file URL
  }>;
  analytics: {              // Movie analytics data
    views: number;         // Total view count
    ratings: Array<{       // User ratings
      userId: string;      // User who rated
      rating: number;      // Rating value (1-5)
    }>;
    averageRating: number; // Calculated average rating
  };
  isSeries: boolean;        // Whether this is a series episode
  seriesInfo?: {            // Series-specific information
    seasonNumber: number;   // Season number
    episodeNumber: number;  // Episode number
    seriesId: string;      // Reference to parent series
  };
  createdAt: Date;          // Record creation timestamp
  updatedAt: Date;          // Record last update timestamp
}
```

#### Movie Schema Details

1. **Basic Information**
   - `title`: Required, string
   - `description`: Required, string
   - `releaseDate`: Required, Date object
   - `duration`: Required, number (minutes)

2. **Content Classification**
   - `languages`: Array of supported audio languages
   - `genres`: Array of genres from predefined list:
     - Action
     - Adventure
     - Comedy
     - Drama
     - Fantasy
     - Horror
     - Mystery
     - Romance
     - Sci-Fi
     - Thriller
     - Western

3. **Media Resources**
   - `trailerUrl`: YouTube URL format validation
   - `quality`: Object containing different quality stream URLs
   - `subtitles`: Array of subtitle tracks
   - `audioTracks`: Array of audio tracks

4. **Cloudinary Integration**
   - `cloudinaryIds`: Tracks resources across multiple Cloudinary accounts
   - Load balancing across 5 Cloudinary accounts
   - Automatic resource distribution

5. **Analytics**
   - View tracking
   - User ratings system
   - Automatic average rating calculation

6. **Series Support**
   - `isSeries`: Boolean flag
   - Optional `seriesInfo` for episodes
   - Season and episode tracking

### User Schema
```typescript
interface User {
  _id: string;                // Unique identifier for the user
  name: string;               // User's full name
  email: string;              // User's email address (unique)
  role: 'user' | 'admin';     // User role
  status: 'active' | 'suspended' | 'banned';  // Account status
  tier: 'basic' | 'premium' | 'vip';  // Subscription tier
  tierValidUntil: Date;       // Subscription expiration date
  canWatch: boolean;          // Streaming permission flag
  activityLog: Array<{        // User activity history
    timestamp: Date;          // Activity timestamp
    action: string;           // Action performed
    details: string;          // Additional information
  }>;
  complaints?: Array<{        // User complaints/issues
    subject: string;          // Complaint subject
    description: string;      // Detailed description
    status: 'open' | 'resolved';  // Complaint status
    timestamp: Date;          // Submission timestamp
  }>;
  createdAt: Date;            // Account creation date
  updatedAt: Date;            // Last update timestamp
}
```

#### User Schema Details

1. **Account Information**
   - `name`: Required, string
   - `email`: Required, unique, string
   - `role`: Required, enum ('user' | 'admin')

2. **Account Status**
   - `status`: Account state management
     - `active`: Normal account access
     - `suspended`: Temporary restriction
     - `banned`: Permanent restriction
   - `canWatch`: Boolean flag for streaming permission

3. **Subscription Management**
   - `tier`: Subscription level
     - `basic`: Standard features
     - `premium`: HD quality, multiple devices
     - `vip`: All features, priority support
   - `tierValidUntil`: Subscription expiration tracking

4. **Activity Tracking**
   - `activityLog`: Array of user activities
     - Timestamp for each action
     - Action type
     - Detailed description

5. **Support System**
   - Optional `complaints` array
   - Complaint tracking
   - Resolution status management

### Relationships

1. **Movie-Series Relationship**
   - Series episodes reference parent series via `seriesInfo.seriesId`
   - Episodes grouped by `seasonNumber` and `episodeNumber`

2. **User-Movie Relationship**
   - Users can rate movies (stored in `movie.analytics.ratings`)
   - View counts tracked per movie

3. **User-Subscription Relationship**
   - Tier determines access levels
   - Automatic expiration handling

### Data Validation

1. **Movie Validation**
   - Required fields enforcement
   - Genre validation against predefined list
   - YouTube URL format validation
   - Duration must be positive number
   - Rating range: 1-5

2. **User Validation**
   - Email format validation
   - Role restriction
   - Status validation
   - Tier validation

### Indexes

1. **Movie Indexes**
   - `title`: Text index for search
   - `genres`: For genre-based queries
   - `isSeries` and `seriesInfo.seriesId`: For series management

2. **User Indexes**
   - `email`: Unique index
   - `status`: For user filtering
   - `tier`: For subscription management

### Usage Examples

1. **Creating a Movie**
```javascript
const movie = new Movie({
  title: "Inception",
  description: "A mind-bending thriller...",
  releaseDate: new Date("2010-07-16"),
  duration: 148,
  languages: ["English", "Hindi"],
  genres: ["Sci-Fi", "Action", "Thriller"],
  trailerUrl: "https://youtube.com/watch?v=YoHD9XEInc0",
  cloudinaryIds: {
    accountId: "1",
    videoId: "movies/abc123",
    thumbnailId: "thumbnails/xyz789"
  }
});
```

2. **Creating a User**
```javascript
const user = new User({
  name: "John Doe",
  email: "john@example.com",
  role: "user",
  status: "active",
  tier: "premium",
  tierValidUntil: new Date("2024-12-31"),
  canWatch: true
});
```

### Best Practices

1. **Movie Management**
   - Always validate file types before upload
   - Maintain proper quality version