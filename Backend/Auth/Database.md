# Database Documentation

This document provides information about the MongoDB schema and relationships used in the Authentication API.

## MongoDB Connection

The application connects to MongoDB using Mongoose. The connection string is specified in the `.env` file:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

## Database Schema

### User Model

The User model represents registered users in the system.

**Collection Name:** `users`

**Schema:**

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'blocked'],
    default: 'pending'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Fields:**

- `name`: The user's full name
- `email`: The user's email address (unique)
- `password`: Bcrypt-hashed password
- `status`: Account status
  - `pending`: Email not yet verified
  - `active`: Email verified, account active
  - `blocked`: Account blocked by admin
- `role`: User role
  - `user`: Regular user (default)
  - `admin`: Administrator with elevated privileges
- `createdAt`: Timestamp when the user was created

### Verification Code Model

The VerificationCode model stores temporary codes for email verification and password reset.

**Collection Name:** `verificationcodes`

**Schema:**

```javascript
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['email', 'reset'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Fields:**

- `userId`: Reference to the User model
- `code`: 6-digit verification code
- `type`: Purpose of the code
  - `email`: For email verification
  - `reset`: For password reset
- `expiresAt`: Timestamp when the code expires (10 minutes after creation)
- `createdAt`: Timestamp when the code was created

**TTL Index:**

The VerificationCode model includes a TTL (Time-To-Live) index on the `expiresAt` field, which automatically removes expired documents:

```javascript
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

## Relationships

### User to VerificationCode Relationship

- **Type**: One-to-Many
- **Description**: A user can have multiple verification codes (for email verification or password reset), but each verification code belongs to exactly one user.
- **Implementation**: The `userId` field in the VerificationCode model references the `_id` field in the User model.

## Data Flow

1. **User Registration**:
   - Create a new User document with status `pending`
   - Generate a verification code
   - Create a new VerificationCode document with type `email`
   - Send the code to the user's email

2. **Email Verification**:
   - Find the VerificationCode document matching the user ID and code
   - Update the User document's status to `active`
   - Delete the VerificationCode document

3. **Password Reset**:
   - Find the User document by email
   - Generate a reset code
   - Create a new VerificationCode document with type `reset`
   - Send the code to the user's email
   - When reset is confirmed, update the User document's password
   - Delete the VerificationCode document

## Security Considerations

- Passwords are hashed using bcrypt before storage
- Verification codes expire after 10 minutes
- Expired verification codes are automatically removed from the database
- JWT tokens are signed with a secret key and expire after 24 hours