// Sample movie data for testing with Postman
const sampleMovieData = {
  // Required form fields
  title: "The Dark Knight",
  description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
  releaseDate: "2008-07-18",
  duration: 152,
  languages: JSON.stringify(["English", "Hindi", "Spanish"]),
  genres: JSON.stringify(["Action", "Drama", "Crime", "Thriller"]),
  trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",

  // Files to upload:
  // 1. thumbnail: Upload any JPG/PNG image file
  // 2. video: Upload any video file (MP4 recommended)
};

/*
Instructions for testing with Postman:

1. Create a new POST request to: http://localhost:3000/movies

2. Headers:
   - Authorization: Bearer your_jwt_token
   
3. Body: Select "form-data"

4. Add the following key-value pairs:
   - title: "The Dark Knight"
   - description: "When the menace known as the Joker wreaks havoc..."
   - releaseDate: "2008-07-18"
   - duration: 152
   - languages: ["English", "Hindi", "Spanish"]
   - genres: ["Action", "Drama", "Crime", "Thriller"]
   - trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY"
   - thumbnail: [Select File] (Upload a movie poster image)
   - video: [Select File] (Upload a movie video file)

Note: For the 'languages' and 'genres' fields, make sure to send them as stringified arrays
      exactly as shown in the sampleMovieData above.

Expected Response (201 Created):
{
  "message": "Movie created successfully",
  "movie": {
    "_id": "...",
    "title": "The Dark Knight",
    "description": "When the menace known as the Joker...",
    "releaseDate": "2008-07-18T00:00:00.000Z",
    "duration": 152,
    "languages": ["English", "Hindi", "Spanish"],
    "genres": ["Action", "Drama", "Crime", "Thriller"],
    "trailerUrl": "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    "thumbnail": {
      "public_id": "account_1/movie-thumbnails/...",
      "url": "https://res.cloudinary.com/..."
    },
    "videoFile": {
      "public_id": "account_2/movies/...",
      "url": "https://res.cloudinary.com/..."
    },
    "createdAt": "2023-12-20T10:00:00.000Z",
    "updatedAt": "2023-12-20T10:00:00.000Z"
  }
}
*/