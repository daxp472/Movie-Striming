const cloudinary = require('cloudinary').v2;

// Configure all 5 Cloudinary instances
const cloudinaryInstances = [
  {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME_1,
    api_key: process.env.CLOUDINARY_API_KEY_1,
    api_secret: process.env.CLOUDINARY_API_SECRET_1
  },
  {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME_2,
    api_key: process.env.CLOUDINARY_API_KEY_2,
    api_secret: process.env.CLOUDINARY_API_SECRET_2
  },
  {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME_3,
    api_key: process.env.CLOUDINARY_API_KEY_3,
    api_secret: process.env.CLOUDINARY_API_SECRET_3
  },
  {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME_4,
    api_key: process.env.CLOUDINARY_API_KEY_4,
    api_secret: process.env.CLOUDINARY_API_SECRET_4
  },
  {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME_5,
    api_key: process.env.CLOUDINARY_API_KEY_5,
    api_secret: process.env.CLOUDINARY_API_SECRET_5
  }
];

class CloudinaryManager {
  constructor() {
    this.currentInstanceIndex = 0;
  }

  getNextCloudinaryInstance() {
    const instance = cloudinaryInstances[this.currentInstanceIndex];
    this.currentInstanceIndex = (this.currentInstanceIndex + 1) % cloudinaryInstances.length;
    return instance;
  }

  async uploadToCloudinary(filePath, options = {}) {
    const config = this.getNextCloudinaryInstance();
    cloudinary.config(config);
    return await cloudinary.uploader.upload(filePath, options);
  }

  async deleteFromCloudinary(public_id, options = {}) {
    // Extract account number from public_id (format: "account_X/...")
    const accountNum = public_id.split('_')[1]?.split('/')[0];
    if (!accountNum || isNaN(parseInt(accountNum)) || parseInt(accountNum) < 1 || parseInt(accountNum) > 5) {
      throw new Error('Invalid public_id format');
    }
    const config = cloudinaryInstances[parseInt(accountNum) - 1];
    cloudinary.config(config);
    return await cloudinary.uploader.destroy(public_id, options);
  }
}

// Create a single instance to be used throughout the application
const cloudinaryManager = new CloudinaryManager();

module.exports = cloudinaryManager;