import axios from 'axios';
import accounts from '../utils/accountConfig';

interface UploadProgressCallback {
  (progress: number): void;
}

interface UploadResponse {
  secure_url: string;
  public_id: string;
}

/**
 * Uploads a file directly to Cloudinary with progress tracking
 * @param file The file to upload
 * @param resourceType 'image' or 'video'
 * @param onProgress Callback function to track upload progress
 * @returns Promise with upload response
 */
export const uploadToCloudinary = async (
  file: File,
  resourceType: 'image' | 'video' = 'image',
  onProgress?: UploadProgressCallback
): Promise<UploadResponse> => {
  // Select an account with available space
  const availableAccount = accounts.find(account => account.spaceAvailable > 0);
  if (!availableAccount) {
    throw new Error('No available accounts for upload.');
  }

  // Reduce available space
  availableAccount.spaceAvailable -= 1;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', availableAccount.uploadPreset); // Use dynamic upload preset

  const url = `https://api.cloudinary.com/v1_1/${availableAccount.cloudName}/${resourceType}/upload`;

  try {
    const response = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    return {
      secure_url: response.data.secure_url,
      public_id: response.data.public_id,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error(`Failed to upload ${resourceType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
