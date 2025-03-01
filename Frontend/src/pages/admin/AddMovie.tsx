import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiPlus, FiX } from "react-icons/fi";
import DatePicker from "react-datepicker"; // Assuming you add this for releaseDate
import "react-datepicker/dist/react-datepicker.css";

const AddMovie = () => {
  const navigate = useNavigate();
  const [isSeriesType, setIsSeriesType] = useState(false);
  const [selectedQualities, setSelectedQualities] = useState(["1080p"]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [releaseDate, setReleaseDate] = useState(new Date());

  const qualities = ["480p", "720p", "1080p", "4K"];
  const languages = ["English", "Spanish", "French", "German", "Hindi"]; // Example languages
  const genres = [
    "Action",
    "Adventure",
    "Comedy",
    "Drama",
    "Fantasy",
    "Horror",
    "Mystery",
    "Romance",
    "Sci-Fi",
    "Thriller",
    "Western",
  ];
  const cloudinaryAccounts = ["1", "2", "3", "4", "5"]; // Matching schema enum

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Collect form data to match movieSchema
    const formData = {
      title: (document.querySelector('input[name="title"]') as HTMLInputElement)?.value || "",
      description: (document.querySelector('textarea[name="description"]') as HTMLTextAreaElement)?.value || "",
      releaseDate: releaseDate.toISOString(),
      duration: parseInt((document.querySelector('input[name="duration"]') as HTMLInputElement)?.value || "0"),
      languages: (document.querySelector('select[name="languages"]') as HTMLSelectElement)?.value.split(",") || [],
      genres: Array.from(
        (document.querySelectorAll('input[name="genres"]:checked') as NodeListOf<HTMLInputElement>) || []
      ).map((checkbox) => checkbox.value),
      trailerUrl: (document.querySelector('input[name="trailerUrl"]') as HTMLInputElement)?.value || "",
      quality: {
        "480p": selectedQualities.includes("480p") ? "" : undefined, // Placeholder for URLs
        "720p": selectedQualities.includes("720p") ? "" : undefined,
        "1080p": selectedQualities.includes("1080p") ? "" : undefined,
        "4K": selectedQualities.includes("4K") ? "" : undefined,
      },
      cloudinaryIds: {
        accountId: (document.querySelector('select[name="accountId"]') as HTMLSelectElement)?.value || "1",
        videoId: "", // To be set after upload
        thumbnailId: "", // To be set after upload
        trailerId: "", // To be set after upload
      },
      subtitles: [], // To be populated with language/url pairs
      audioTracks: [], // To be populated with language/url pairs
      isSeries: isSeriesType,
      seriesInfo: isSeriesType
        ? {
            seasonNumber: parseInt((document.querySelector('input[name="seasonNumber"]') as HTMLInputElement)?.value || "0"),
            episodeNumber: parseInt((document.querySelector('input[name="episodeNumber"]') as HTMLInputElement)?.value || "0"),
            seriesId: "", // To be set if part of a series
          }
        : undefined,
    };

    console.log("Form Data:", formData); // Replace with API call
    // Implement API call to save movie (e.g., using fetch or axios)
    navigate("/admin/movies");
  };

  const toggleQuality = (quality: string) => {
    setSelectedQualities((prev) =>
      prev.includes(quality) ? prev.filter((q) => q !== quality) : [...prev, quality]
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-transparent">
      {/* Gradient background with full coverage */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-purple-700/30 blur-[120px]"></div>
        <div className="absolute -right-1/4 bottom-0 h-[700px] w-[700px] rounded-full bg-indigo-700/30 blur-[120px]"></div>
        <div className="absolute left-1/3 top-1/3 h-[400px] w-[400px] rounded-full bg-fuchsia-700/20 blur-[120px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-6 space-y-6">
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Add New Movie
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400">
                Title
              </label>
              <input
                type="text"
                name="title"
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 backdrop-blur-sm"
                placeholder="Enter movie title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">
                Type
              </label>
              <select
                name="type"
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 backdrop-blur-sm"
                onChange={(e) => setIsSeriesType(e.target.value === "series")}
              >
                <option value="movie">Movie</option>
                <option value="series">Series</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 backdrop-blur-sm"
                placeholder="Enter movie description"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">
                Release Date
              </label>
              <DatePicker
                selected={releaseDate}
                onChange={(date: Date) => setReleaseDate(date)}
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 backdrop-blur-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">
                Duration (minutes)
              </label>
              <input
                type="number"
                name="duration"
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 backdrop-blur-sm"
                placeholder="Enter duration"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400">
                Languages
              </label>
              <select
                name="languages"
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 backdrop-blur-sm"
                multiple
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400">
                Genres
              </label>
              <div className="mt-1 space-y-2">
                {genres.map((genre) => (
                  <div key={genre} className="flex items-center">
                    <input
                      type="checkbox"
                      name="genres"
                      value={genre}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 bg-gray-800"
                    />
                    <label className="ml-2 text-sm text-gray-400">{genre}</label>
                  </div>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400">
                Trailer URL
              </label>
              <input
                type="text"
                name="trailerUrl"
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 backdrop-blur-sm"
                placeholder="Enter YouTube URL"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400">
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
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-400"
                    } hover:bg-purple-600 hover:text-white transition-colors duration-200`}
                  >
                    {quality}
                    {selectedQualities.includes(quality) && <FiX className="ml-2 h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400">
                Upload Video
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-700 bg-gray-800/50 px-6 pt-5 pb-6 backdrop-blur-sm">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-400">
                    <label className="relative cursor-pointer rounded-md font-medium text-purple-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 hover:text-purple-300">
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
                        <span className="text-xs font-semibold text-purple-400">
                          Upload Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-purple-400">
                          {uploadProgress}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-purple-600"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isSeriesType && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-400">
                  Series Details
                </label>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="seasonNumber"
                    placeholder="Season Number"
                    className="rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 backdrop-blur-sm"
                  />
                  <input
                    type="number"
                    name="episodeNumber"
                    placeholder="Episode Number"
                    className="rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 backdrop-blur-sm"
                  />
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400">
                Cloudinary Account
              </label>
              <select
                name="accountId"
                className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-white placeholder-gray-500 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 backdrop-blur-sm"
              >
                {cloudinaryAccounts.map((account) => (
                  <option key={account} value={account}>
                    Account {account}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/movies")}
              className="rounded-md border border-gray-700 bg-gray-800/50 px-4 py-2 text-sm font-medium text-gray-400 shadow-sm hover:bg-gray-700 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors duration-200"
            >
              Create Movie
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovie;