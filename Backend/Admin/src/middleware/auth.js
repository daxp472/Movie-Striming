const jwt = require('jsonwebtoken');
const adminEmails = require('../config/adminEmails');

const isAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user has admin role OR their email is in the admin list
    const hasAdminAccess = decoded.isAdmin || adminEmails.includes(decoded.email);
    
    if (!hasAdminAccess) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { isAdmin };