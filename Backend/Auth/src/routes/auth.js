import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import VerificationCode from '../models/VerificationCode.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email.js';
import { authenticateToken } from '../middleware/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Generate random verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create expiration date (10 minutes from now)
const createExpirationDate = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

// Registration validation middleware
const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Registration route
router.post('/register', registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      status: 'pending',
      role: role || 'user'
    });

    await user.save();

    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Save verification code
    const newVerificationCode = new VerificationCode({
      userId: user._id,
      code: verificationCode,
      type: 'email',
      expiresAt: createExpirationDate()
    });

    await newVerificationCode.save();

    try {
      // Send verification email
      await sendVerificationEmail(email, verificationCode);
      res.status(201).json({ 
        message: 'Registration successful. Please check your email for verification code.',
        userId: user._id,
        code: verificationCode // Only for testing, remove in production
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(201).json({ 
        message: 'Registration successful but email sending failed. Please contact support.',
        userId: user._id,
        code: verificationCode // Only for testing, remove in production
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Email verification route
router.post('/verify', async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ message: 'User ID and verification code are required' });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status === 'active') {
      return res.status(400).json({ message: 'Account is already verified' });
    }

    // Find verification code
    const verificationCode = await VerificationCode.findOne({
      userId: userId,
      code: code,
      type: 'email'
    });

    if (!verificationCode) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if code is expired
    if (verificationCode.expiresAt < new Date()) {
      await VerificationCode.deleteOne({ _id: verificationCode._id });
      return res.status(400).json({ message: 'Verification code has expired' });
    }

    // Update user status
    user.status = 'active';
    await user.save();

    // Delete verification code
    await VerificationCode.deleteOne({ _id: verificationCode._id });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Account verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is verified
    if (user.status !== 'active') {
      return res.status(400).json({ message: 'Please verify your account first' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Forgot password route
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Invalid email address')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset code
    const resetCode = generateVerificationCode();
    
    // Delete any existing reset codes for this user
    await VerificationCode.deleteMany({ userId: user._id, type: 'reset' });
    
    // Save reset code
    const newResetCode = new VerificationCode({
      userId: user._id,
      code: resetCode,
      type: 'reset',
      expiresAt: createExpirationDate()
    });

    await newResetCode.save();

    try {
      // Send reset email
      await sendPasswordResetEmail(email, resetCode);
      res.json({ 
        message: 'Password reset code sent to your email',
        userId: user._id,
        code: resetCode // Only for testing, remove in production
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(500).json({ message: 'Failed to send reset email' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password route
router.post('/reset-password', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('code').notEmpty().withMessage('Reset code is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, code, newPassword } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find reset code
    const resetCode = await VerificationCode.findOne({
      userId: userId,
      code: code,
      type: 'reset'
    });

    if (!resetCode) {
      return res.status(400).json({ message: 'Invalid reset code' });
    }

    // Check if code is expired
    if (resetCode.expiresAt < new Date()) {
      await VerificationCode.deleteOne({ _id: resetCode._id });
      return res.status(400).json({ message: 'Reset code has expired' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    user.password = hashedPassword;
    await user.save();

    // Delete reset code
    await VerificationCode.deleteOne({ _id: resetCode._id });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Token refresh route
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Get user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Generate new refresh token
    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Refresh token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes'
});

// Apply rate limiter to auth routes
router.use('/login', authLimiter);
router.use('/register', authLimiter);
router.use('/forgot-password', authLimiter);

// Get current user route
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;