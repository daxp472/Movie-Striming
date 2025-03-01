# Authentication API Integration Guide for Frontend Developers

This document provides guidance on how to integrate with the Authentication API from a frontend application.

## Base URL

```
http://localhost:3000/api/auth
```

## API Endpoints

### 1. User Registration

Register a new user account.

```http
POST /api/auth/register
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
  "message": "Registration successful. Please check your email for verification code.",
  "userId": "user_id"
}
```

### 2. Email Verification

Verify a user's email using the code received via email.

```http
POST /api/auth/verify
```

**Request Body:**
```json
{
  "userId": "user_id",
  "code": "123456"
}
```

**Response:**
- Success (200):
```json
{
  "message": "Account verified successfully",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 3. User Login

Login with verified credentials.

```http
POST /api/auth/login
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
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### 4. Forgot Password

Request a password reset code.

```http
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
- Success (200):
```json
{
  "message": "Password reset code sent to your email",
  "userId": "user_id"
}
```

### 5. Reset Password

Reset password using the code received via email.

```http
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "userId": "user_id",
  "code": "123456",
  "newPassword": "newpassword123"
}
```

**Response:**
- Success (200):
```json
{
  "message": "Password reset successful"
}
```

### 6. Get Current User

Get the currently authenticated user's information.

```http
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer jwt_token
```

**Response:**
- Success (200):
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "status": "active",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

## Authentication

After logging in or verifying an account, include the JWT token in the Authorization header for protected routes:

```http
Authorization: Bearer jwt_token
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors, invalid credentials)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Server Error

## Implementation Example (JavaScript)

```javascript
// Registration
async function registerUser(userData) {
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
}

// Email Verification
async function verifyEmail(userId, code) {
  const response = await fetch('http://localhost:3000/api/auth/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, code }),
  });
  return response.json();
}

// Login
async function loginUser(credentials) {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

// Get Current User
async function getCurrentUser(token) {
  const response = await fetch('http://localhost:3000/api/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}
```

## User Flow

1. User registers with name, email, and password
2. User receives verification code via email
3. User verifies email with the code
4. User logs in with email and password
5. Frontend stores JWT token in localStorage or secure cookie
6. Frontend includes token in Authorization header for subsequent requests