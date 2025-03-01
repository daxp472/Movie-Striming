# Movie Streaming API Documentation

This document provides information about the authentication endpoints available in the Movie Streaming API.

## Base URL
```
http://localhost:3000/api/auth
```

## Authentication Endpoints

### 1. Register User
Register a new user account.

```http
POST /register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
- Success (201):
```json
{
  "message": "Registration successful. Please check your email for activation code."
}
```
- Error (400):
```json
{
  "message": "User already exists"
}
```

### 2. Activate Account
Activate a user account using the code received via email.

```http
POST /activate
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "activationCode": "ABC123"
}
```

**Response:**
- Success (200):
```json
{
  "message": "Account activated successfully"
}
```
- Error (400):
```json
{
  "message": "Invalid activation code"
}
```

### 3. Login
Login with an activated account.

```http
POST /login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
- Success (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "canWatch": false
  }
}
```
- Error (400):
```json
{
  "message": "Invalid credentials"
}
```

### 4. Admin Approval
Request admin approval to enable movie watching capabilities.

```http
POST /admin/approve
```

**Request Body:**
```json
{
  "userId": "user_id",
  "adminPassword": "1875"
}
```

**Response:**
- Success (200):
```json
{
  "message": "User approved successfully"
}
```
- Error (403):
```json
{
  "message": "Invalid admin password"
}
```

## Authentication

After logging in, include the JWT token in the Authorization header for protected routes:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Server Error

## Registration Flow

1. Register using the `/register` endpoint
2. Check email for activation code
3. Activate account using `/activate` endpoint
4. Login using `/login` endpoint
5. Request admin approval using `/admin/approve` endpoint
6. Once approved, the user can watch movies

## Notes

- Passwords must be at least 6 characters long
- Email verification is required before login
- Admin approval is required before watching movies
- JWT tokens expire after 24 hours