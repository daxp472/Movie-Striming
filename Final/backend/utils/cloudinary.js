import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import { getCloudinaryConfig } from '../config/cloudinaryConfig.js';

dotenv.config();

// Configure Cloudinary with dynamic account selection
const configureCloudinary = (accountName = 'default') => {
  const config = getCloudinaryConfig(accountName);
  cloudinary.config(config);
  console.log('Cloudinary Configuration:', {
    cloud_name: config.cloud_name,
    configured: !!config.api_key && !!config.api_secret,
    account: accountName
  });
};

// Initialize with default account
configureCloudinary();

// Upload image to Cloudinary
const uploadImage = async (filePath, accountName = 'default') => {
  try {
    configureCloudinary(accountName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    console.log(`Uploading image from ${filePath} to Cloudinary (${accountName})...`);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'movie_posters',
      resource_type: 'auto',
      chunk_size: 20000000, // 20MB chunks for faster uploads
      eager: [
        { width: 300, height: 450, crop: "fill" },
        { width: 800, height: 1200, crop: "fill" }
      ],
      eager_async: true
    });
    console.log(`Image uploaded successfully to Cloudinary with ID: ${result.public_id}`);
    return result;
  } catch (error) {
    console.error(`Error uploading image to Cloudinary: ${error.message}`);
    if (error.http_code) {
      console.error(`Cloudinary HTTP error code: ${error.http_code}`);
    }
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Upload video to Cloudinary with support for multiple formats
const uploadVideo = async (filePath, accountName = 'default') => {
  try {
    configureCloudinary(accountName);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    console.log(`Uploading video from ${filePath} to Cloudinary (${accountName})...`);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'movies',
      resource_type: 'video',
      chunk_size: 20000000, // 20MB chunks
      allowed_formats: ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'],
      eager: [
        { streaming_profile: "full_hd", format: "mp4" },
        { streaming_profile: "hd", format: "mp4" }
      ],
      eager_async: true,
      max_file_size: 10000000000 // 10GB limit
    });
    console.log(`Video uploaded successfully to Cloudinary with ID: ${result.public_id}`);
    return result;
  } catch (error) {
    console.error(`Error uploading video to Cloudinary: ${error.message}`);
    if (error.http_code) {
      console.error(`Cloudinary HTTP error code: ${error.http_code}`);
    }
    // If upload fails with primary account, try backup
    if (accountName === 'default') {
      console.log('Retrying upload with backup account...');
      return uploadVideo(filePath, 'backup');
    }
    throw new Error(`Failed to upload video: ${error.message}`);
  }
};

// Delete resource from Cloudinary
const deleteResource = async (publicId, resourceType = 'image', accountName = 'default') => {
  try {
    configureCloudinary(accountName);
    if (!publicId) {
      console.warn('No publicId provided for deletion, skipping');
      return { result: 'skipped' };
    }
    
    console.log(`Deleting resource from Cloudinary (${accountName}): ${publicId} (type: ${resourceType})`);
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    console.log(`Resource deletion result: ${result.result}`);
    return result;
  } catch (error) {
    console.error(`Error deleting resource from Cloudinary: ${error.message}`);
    return { result: 'error', error: error.message };
  }
};

export { uploadImage, uploadVideo, deleteResource };