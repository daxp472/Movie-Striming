import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiPlus, FiX } from 'react-icons/fi';

const AddMovie = () => {
  const navigate = useNavigate();
  const [isSeriesType, setIsSeriesType] = useState(false);
  const [selectedQualities, setSelectedQualities] = useState(['1080p']);
  const [uploadProgress, setUploadProgress] = useState(0);

  const qualities = ['480p', '720p', '1080p', '4K'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement movie creation logic here
    navigate('/admin/movies');
  };

  const toggleQuality = (quality: string) => {
    setSelectedQualities((prev) =>
      prev.includes(quality)
        ? prev.filter((q) => q !== quality)
        : [...prev, quality]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Add New Movie</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(e) => setIsSeriesType(e.target.value === 'series')}
            >
              <option value="movie">Movie</option>
              <option value="series">Series</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {isSeriesType && (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Seasons
              </label>
              <div className="mt-1 space-y-4">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <FiPlus className="mr-2 h-5 w-5" />
                  Add Season
                </button>
              </div>
            </div>
          )}

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Available Qualities
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {qualities.map((quality) => (
                <button
                  key={quality}
                  type="button"
                  onClick={() => toggleQuality(quality)}
                  className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${
                    selectedQualities.includes(quality)
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {quality}
                  {selectedQualities.includes(quality) && (
                    <FiX className="ml-2 h-4 w-4" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Video
            </label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500">
                    <span>Upload a file</span>
                    <input type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">MP4, MKV up to 10GB</p>
              </div>
            </div>
            {uploadProgress > 0 && (
              <div className="mt-2">
                <div className="relative pt-1">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-blue-600">
                        Upload Progress
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-blue-600">
                        {uploadProgress}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/movies')}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Create Movie
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;
