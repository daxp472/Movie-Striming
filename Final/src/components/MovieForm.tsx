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
      variant: 'destructive',
      title: 'Upload Error',
      description: error,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title || !description || !genre || !duration || !releaseYear) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    if (!movie && (!posterUrl || !videoUrl)) {
      toast({
        variant: 'destructive',
        title: 'Missing files',
        description: 'Please upload both poster and video files.',
      });
      return;
    }

    try {
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
    <form onSubmit={handleSubmit} className="space-y-6 text-white">
      {uploadError && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm">
          {uploadError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-300">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Movie title"
              required
              className="bg-black/20 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Movie description"
              required
              rows={4}
              className="bg-black/20 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Genre</Label>
            <Select value={genre} onValueChange={setGenre} required>
              <SelectTrigger className="bg-black/20 border border-white/20 text-white rounded-xl p-2 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent className="bg-black/80 border border-white/20 text-white backdrop-blur-md rounded-xl">
                {genres.map(g => (
                  <SelectItem
                    key={g}
                    value={g}
                    className="hover:bg-purple-600/20 focus:bg-purple-600/30 transition-colors duration-200"
                  >
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-300">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="120"
                min="1"
                required
                className="bg-black/20 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Release Year</Label>
              <Input
                id="releaseYear"
                type="number"
                value={releaseYear}
                onChange={e => setReleaseYear(e.target.value)}
                placeholder="2023"
                min="1900"
                max={new Date().getFullYear()}
                required
                className="bg-black/20 border border-white/20 rounded-xl p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-gray-300">Poster Image</Label>
            {posterUrl ? (
              <div className="relative bg-black/20 border border-white/20 rounded-xl p-4">
                <img
                  src={posterUrl}
                  alt="Poster preview"
                  className="w-full h-64 object-contain mb-2 rounded-lg"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="w-full bg-purple-600 text-white rounded-xl hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
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
                className="bg-black/20 text-white border border-white/20 rounded-xl p-3"
              />
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Video File</Label>
            {videoUrl ? (
              <div className="bg-black/20 border border-white/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">Video uploaded successfully</span>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="bg-purple-600 text-white rounded-xl hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                    onClick={() => {
                      setVideoUrl('');
                      setVideoPublicId('');
                    }}
                  >
                    Change
                  </Button>
                </div>
                <video
                  className="mt-2 w-full max-h-40 object-contain rounded-lg"
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
                className="bg-black/20 text-white border border-white/20 rounded-xl p-3"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-purple-600 text-white font-medium px-6 py-3 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
        >
          {isLoading ? 'Saving...' : movie ? 'Update Movie' : 'Add Movie'}
        </Button>
      </div>
    </form>
  );
};

export default MovieForm;