import dotenv from 'dotenv';
dotenv.config();

// Default Cloudinary configuration
const defaultConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Additional Cloudinary accounts configuration
const accounts = {
  default: defaultConfig,
  backup: {
    cloud_name: process.env.CLOUDINARY_BACKUP_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_BACKUP_API_KEY,
    api_secret: process.env.CLOUDINARY_BACKUP_API_SECRET,
  },
  // Add more accounts as needed
};

// Get Cloudinary configuration for a specific account
const getCloudinaryConfig = (accountName = 'default') => {
  return accounts[accountName] || defaultConfig;
};

export { getCloudinaryConfig };
