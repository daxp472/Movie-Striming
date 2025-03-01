# MovieFlix - Movie Streaming Platform

A modern movie streaming platform with advanced features built using React, TypeScript, and Tailwind CSS.

## Features

### User Features
- User authentication (login, register, email verification)
- Browse movies with advanced filtering
- Movie details with trailer and information
- Movie streaming with quality options
- Watchlist management
- Watch history tracking
- User profile management
- Preference settings

### Admin Features
- Dashboard with analytics
- Movie management (add, edit, delete)
- User management
- Content approval
- File uploads with Cloudinary

## Tech Stack

### Frontend
- React 18
- TypeScript
- React Router v6
- Tailwind CSS
- Axios for API requests
- React Hot Toast for notifications
- React Player for video playback
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- Cloudinary for media storage
- Microservices architecture

## Project Structure

```
src/
├── components/
│   ├── auth/
│   ├── layouts/
│   ├── movies/
│   └── navigation/
├── config/
│   └── api.ts
├── context/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── hooks/
│   ├── useApi.ts
│   └── useForm.ts
├── pages/
│   ├── admin/
│   ├── auth/
│   └── user/
├── services/
│   ├── adminService.ts
│   ├── authService.ts
│   └── userService.ts
├── utils/
│   └── helpers.ts
├── App.tsx
└── main.tsx
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Backend Services

The application connects to three microservices:

1. **Auth API (Port 4000)**: Handles user authentication
2. **User API (Port 5001)**: Manages movie streaming and user interactions
3. **Admin API (Port 5002)**: Provides movie and user management for admins

## Subscription Tiers

### Basic Plan
- 720p streaming
- 1 device
- Basic features

### Premium Plan
- 1080p streaming
- 2 devices
- Advanced features

### VIP Plan
- 4K streaming
- 4 devices
- Premium + exclusive features

## Environment Variables

Create a `.env` file with the following variables:

```
VITE_AUTH_API_URL=http://localhost:4000/api
VITE_USER_API_URL=http://localhost:5001/api
VITE_ADMIN_API_URL=http://localhost:5002/api
```

## License

This project is licensed under the MIT License.
