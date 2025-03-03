import React, { useState, useRef } from 'react';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

interface FileUploadProps {
  resourceType: 'image' | 'video';
  onUploadSuccess: (url: string, publicId: string) => void;
  onUploadError: (error: string) => void;
  label: string;
  accept: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  resourceType,
  onUploadSuccess,
  onUploadError,
  label,
  accept
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsUploading(true);
    setProgress(0);

    try {
      const result = await uploadToCloudinary(
        file,
        resourceType,
        (progress) => setProgress(progress)
      );

      onUploadSuccess(result.secure_url, result.public_id);
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      onUploadError(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
      />
      
      <div className="flex flex-col">
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={isUploading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
        >
          {isUploading ? 'Uploading...' : 'Select File'}
        </button>
        
        {fileName && (
          <p className="mt-2 text-sm text-gray-600">
            Selected file: {fileName}
          </p>
        )}
        
        {isUploading && (
          <div className="w-full mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-600 mt-1">{progress}% Uploaded</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
