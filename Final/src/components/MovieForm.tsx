import React, { useState } from 'react';
import { Movie } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import FileUpload from './FileUpload';

interface MovieFormProps {
  movie?: Movie;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

const genres = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
];

const MovieForm: React.FC<MovieFormProps> = ({ movie, onSubmit, isLoading }) => {
  const [title, setTitle] = useState(movie?.title || '');
  const [description, setDescription] = useState(movie?.description || '');
  const [genre, setGenre] = useState(movie?.genre || '');
  const [duration, setDuration] = useState(movie?.duration?.toString() || '');
  const [releaseYear, setReleaseYear] = useState(movie?.releaseYear?.toString() || '');
  
  // New state for Cloudinary URLs and IDs
  const [posterUrl, setPosterUrl] = useState<string>(movie?.posterUrl || '');
  const [posterPublicId, setPosterPublicId] = useState<string>(movie?.posterPublicId || '');
  const [videoUrl, setVideoUrl] = useState<string>(movie?.videoUrl || '');
  const [videoPublicId, setVideoPublicId] = useState<string>(movie?.videoPublicId || '');
  
  // Upload status
  const [uploadError, setUploadError] = useState<string>('');
  
  const { toast } = useToast();

  const handlePosterUploadSuccess = (url: string, publicId: string) => {
    setPosterUrl(url);
    setPosterPublicId(publicId);
    setUploadError('');
  };

  const handleVideoUploadSuccess = (url: string, publicId: string) => {
    setVideoUrl(url);
    setVideoPublicId(publicId);
    setUploadError('');
  };

  const handleUploadError = (error: string) => {
    setUploadError(error);
    toast({
      variant: "destructive",
      title: "Upload Error",
      description: error,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title || !description || !genre || !duration || !releaseYear) {
      toast({
        variant: "destructive",
        title: "Missing fields",
        description: "Please fill in all required fields.",
      });
      return;
    }
    
    if (!movie && (!posterUrl || !videoUrl)) {
      toast({
        variant: "destructive",
        title: "Missing files",
        description: "Please upload both poster and video files.",
      });
      return;
    }
    
    try {
      // Instead of FormData with files, we'll send JSON with Cloudinary URLs
      const movieData = {
        title,
        description,
        genre,
        duration,
        releaseYear,
        posterUrl,
        posterPublicId,
        videoUrl,
        videoPublicId,
      };
      
      // Convert to FormData for compatibility with existing API function
      const formData = new FormData();
      Object.entries(movieData).forEach(([key, value]) => {
        if (value) formData.append(key, value.toString());
      });
      
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {uploadError}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Movie title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Movie description"
              required
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Select value={genre} onValueChange={setGenre} required>
              <SelectTrigger>
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>{g}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="120"
                min="1"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="releaseYear">Release Year</Label>
              <Input
                id="releaseYear"
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
                placeholder="2023"
                min="1900"
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Poster Image</Label>
            {posterUrl ? (
              <div className="relative border rounded-lg p-4">
                <img 
                  src={posterUrl} 
                  alt="Poster preview" 
                  className="w-full h-64 object-contain mb-2"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setPosterUrl('');
                    setPosterPublicId('');
                  }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <FileUpload
                resourceType="image"
                onUploadSuccess={handlePosterUploadSuccess}
                onUploadError={handleUploadError}
                label="Upload Poster Image"
                accept="image/*"
              />
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Video File</Label>
            {videoUrl ? (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm">Video uploaded successfully</span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setVideoUrl('');
                      setVideoPublicId('');
                    }}
                  >
                    Change
                  </Button>
                </div>
                {/* Show video preview if it's not too large */}
                <video 
                  className="mt-2 w-full max-h-40 object-contain" 
                  controls
                  src={videoUrl}
                />
              </div>
            ) : (
              <FileUpload
                resourceType="video"
                onUploadSuccess={handleVideoUploadSuccess}
                onUploadError={handleUploadError}
                label="Upload Video File"
                accept="video/*"
              />
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : movie ? 'Update Movie' : 'Add Movie'}
        </Button>
      </div>
    </form>
  );
};

export default MovieForm;