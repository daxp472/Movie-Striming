import React from "react";
import { useNavigate } from "react-router-dom";
import { Film, Upload, X, Plus, AlertCircle } from "lucide-react";
import { useForm } from "../../hooks/useForm";
import { adminService } from "../../services/adminService";

interface Episode {
  name: string;
  videoFile: File | null;
}

interface Season {
  name: string;
  episodes: Episode[];
}

interface MovieFormData {
  title: string;
  description: string;
  releaseYear: string;
  duration: string;
  genre: string[];
  director: string;
  cast: string[];
  maturityRating: string;
  thumbnailUrl: string;
  status: "active" | "inactive" | "pending";
  isSeries: boolean;
  seasons: Season[];
  videoFile: File | null;
  trailerFile: File | null;
  error?: string; // Optional for form-level error
}

const AddMovie: React.FC = () => {
  const navigate = useNavigate();

  const initialValues: MovieFormData = {
    title: "",
    description: "",
    releaseYear: new Date().getFullYear().toString(),
    duration: "",
    genre: [],
    director: "",
    cast: [""], // Start with one empty cast member
    maturityRating: "PG-13",
    thumbnailUrl: "",
    status: "pending",
    isSeries: false,
    seasons: [{ name: "Season 1", episodes: [{ name: "Episode 1", videoFile: null }] }],
    videoFile: null,
    trailerFile: null,
  };

  const validators = {
    title: (value: string) => (value.trim() === "" ? "Title is required" : null),
    description: (value: string) => (value.trim() === "" ? "Description is required" : null),
    releaseYear: (value: string) => {
      const year = parseInt(value);
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 5) {
        return "Enter a valid year";
      }
      return null;
    },
    duration: (value: string, values: MovieFormData) => {
      if (!values.isSeries) {
        const duration = parseInt(value);
        if (isNaN(duration) || duration <= 0) {
          return "Enter a valid duration in minutes";
        }
      }
      return null;
    },
  };

  const { values, errors, handleChange, handleSubmit, setFieldValue } = useForm<MovieFormData>({
    initialValues,
    validators,
    onSubmit: async (formData) => {
      const movieData = {
        ...formData,
        cast: formData.cast.filter((member) => member.trim() !== ""),
        releaseYear: parseInt(formData.releaseYear),
        duration: formData.isSeries ? "0" : parseInt(formData.duration).toString(),
      };

      const formDataToSubmit = new FormData();
      Object.entries(movieData).forEach(([key, value]) => {
        if (key !== "videoFile" && key !== "trailerFile" && key !== "seasons" && key !== "error") {
          formDataToSubmit.append(key, JSON.stringify(value));
        }
      });

      if (!movieData.isSeries) {
        if (movieData.videoFile) formDataToSubmit.append("videoFile", movieData.videoFile);
        if (movieData.trailerFile) formDataToSubmit.append("trailerFile", movieData.trailerFile);
      } else {
        formDataToSubmit.append(
          "seasons",
          JSON.stringify(
            movieData.seasons.map((season) => ({
              name: season.name,
              episodeCount: season.episodes.length,
            }))
          )
        );
        movieData.seasons.forEach((season, sIdx) => {
          season.episodes.forEach((episode, eIdx) => {
            if (episode.videoFile) {
              formDataToSubmit.append(`season${sIdx}_episode${eIdx}_file`, episode.videoFile);
            }
          });
        });
      }

      if (movieData.thumbnailUrl) formDataToSubmit.append("thumbnailFile", "file-object-would-go-here");

      try {
        await adminService.addMovie(formDataToSubmit);
        navigate("/admin/movies");
      } catch (err) {
        console.error("Failed to add movie:", err);
        setFieldValue("error", "Failed to add movie. Please try again.");
      }
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFieldValue("thumbnailUrl", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFieldValue("videoFile", file);
  };

  const handleTrailerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFieldValue("trailerFile", file);
  };

  const handleGenreToggle = (genre: string) =>
    setFieldValue(
      "genre",
      values.genre.includes(genre) ? values.genre.filter((g) => g !== genre) : [...values.genre, genre]
    );

  const handleCastChange = (index: number, value: string) => {
    const newCast = [...values.cast];
    newCast[index] = value;
    setFieldValue("cast", newCast);
  };

  const addCastMember = () => setFieldValue("cast", [...values.cast, ""]);
  const removeCastMember = (index: number) => {
    if (values.cast.length > 1) setFieldValue("cast", values.cast.filter((_, i) => i !== index));
  };

  const handleSeasonNameChange = (index: number, value: string) => {
    const newSeasons = [...values.seasons];
    newSeasons[index].name = value;
    setFieldValue("seasons", newSeasons);
  };

  const addSeason = () =>
    setFieldValue("seasons", [
      ...values.seasons,
      { name: `Season ${values.seasons.length + 1}`, episodes: [{ name: "Episode 1", videoFile: null }] },
    ]);

  const removeSeason = (index: number) => {
    if (values.seasons.length > 1) setFieldValue("seasons", values.seasons.filter((_, i) => i !== index));
  };

  const handleEpisodeNameChange = (seasonIndex: number, episodeIndex: number, value: string) => {
    const newSeasons = [...values.seasons];
    newSeasons[seasonIndex].episodes[episodeIndex].name = value;
    setFieldValue("seasons", newSeasons);
  };

  const handleEpisodeFileChange = (seasonIndex: number, episodeIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newSeasons = [...values.seasons];
      newSeasons[seasonIndex].episodes[episodeIndex].videoFile = file;
      setFieldValue("seasons", newSeasons);
    }
  };

  const addEpisode = (seasonIndex: number) => {
    const newSeasons = [...values.seasons];
    newSeasons[seasonIndex].episodes.push({
      name: `Episode ${newSeasons[seasonIndex].episodes.length + 1}`,
      videoFile: null,
    });
    setFieldValue("seasons", newSeasons);
  };

  const removeEpisode = (seasonIndex: number, episodeIndex: number) => {
    if (values.seasons[seasonIndex].episodes.length > 1) {
      const newSeasons = [...values.seasons];
      newSeasons[seasonIndex].episodes = newSeasons[seasonIndex].episodes.filter((_, i) => i !== episodeIndex);
      setFieldValue("seasons", newSeasons);
    }
  };

  const genres = ["Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller"];
  const maturityRatings = ["G", "PG", "PG-13", "R", "NC-17", "TV-Y", "TV-G", "TV-PG", "TV-14", "TV-MA"];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New {values.isSeries ? "Series" : "Movie"}</h1>
      </div>

      {values.error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-red-100">{values.error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={values.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-black/40 border ${errors.title ? "border-red-500" : "border-white/10"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Enter title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={values.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2 bg-black/40 border ${errors.description ? "border-red-500" : "border-white/10"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="Enter description"
              />
              {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
            </div>

            <div className="flex items-center">
              <label htmlFor="isSeries" className="mr-2 text-sm font-medium text-gray-300">
                Is this a series?
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.isSeries}
                  onChange={() => setFieldValue("isSeries", !values.isSeries)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-black/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="releaseYear" className="block text-sm font-medium text-gray-300 mb-1">
                  Release Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="releaseYear"
                  name="releaseYear"
                  value={values.releaseYear}
                  onChange={handleChange}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  className={`w-full px-4 py-2 bg-black/40 border ${errors.releaseYear ? "border-red-500" : "border-white/10"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                {errors.releaseYear && <p className="mt-1 text-sm text-red-500">{errors.releaseYear}</p>}
              </div>
              {!values.isSeries && (
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">
                    Duration (min) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={values.duration}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-4 py-2 bg-black/40 border ${errors.duration ? "border-red-500" : "border-white/10"} rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                  {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
                </div>
              )}
              {values.isSeries && (
                <div>
                  <label htmlFor="maturityRating" className="block text-sm font-medium text-gray-300 mb-1">
                    Maturity Rating
                  </label>
                  <select
                    id="maturityRating"
                    name="maturityRating"
                    value={values.maturityRating}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {maturityRatings.map((rating) => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {!values.isSeries && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="director" className="block text-sm font-medium text-gray-300 mb-1">
                    Director
                  </label>
                  <input
                    type="text"
                    id="director"
                    name="director"
                    value={values.director}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter director name"
                  />
                </div>
                <div>
                  <label htmlFor="maturityRating" className="block text-sm font-medium text-gray-300 mb-1">
                    Maturity Rating
                  </label>
                  <select
                    id="maturityRating"
                    name="maturityRating"
                    value={values.maturityRating}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {maturityRatings.map((rating) => (
                      <option key={rating} value={rating}>{rating}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Cast</label>
              <div className="space-y-2">
                {values.cast.map((member, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="text"
                      value={member}
                      onChange={(e) => handleCastChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter actor name"
                    />
                    <button
                      type="button"
                      onClick={() => removeCastMember(index)}
                      className="ml-2 p-2 text-gray-400 hover:text-red-500"
                      disabled={values.cast.length === 1}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCastMember}
                  className="flex items-center text-sm text-purple-400 hover:text-purple-300"
                >
                  <Plus size={16} className="mr-1" />
                  Add Cast Member
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Genres</label>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => handleGenreToggle(genre)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      values.genre.includes(genre) ? "bg-purple-600 text-white" : "bg-black/40 border border-white/10 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail Image</label>
              <div className="mt-1 flex items-center">
                <div className="w-32 h-20 bg-black/60 border border-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                  {values.thumbnailUrl ? (
                    <img src={values.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  ) : (
                    <Film size={24} className="text-gray-400" />
                  )}
                </div>
                <label className="ml-4 cursor-pointer">
                  <div className="flex items-center px-4 py-2 bg-black/60 border border-white/10 rounded-lg text-white hover:bg-white/10">
                    <Upload size={18} className="mr-2" />
                    <span>Upload</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                </label>
              </div>
            </div>

            {!values.isSeries && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Video File <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex items-center">
                    <div className="flex-1 px-4 py-2 bg-black/60 border border-white/10 rounded-lg text-white overflow-hidden text-ellipsis whitespace-nowrap">
                      {values.videoFile ? values.videoFile.name : "No file selected"}
                    </div>
                    <label className="ml-4 cursor-pointer">
                      <div className="flex items-center px-4 py-2 bg-black/60 border border-white/10 rounded-lg text-white hover:bg-white/10">
                        <Upload size={18} className="mr-2" />
                        <span>Upload</span>
                      </div>
                      <input type="file" accept="video/*" onChange={handleVideoFileChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Trailer File</label>
                  <div className="mt-1 flex items-center">
                    <div className="flex-1 px-4 py-2 bg-black/60 border border-white/10 rounded-lg text-white overflow-hidden text-ellipsis whitespace-nowrap">
                      {values.trailerFile ? values.trailerFile.name : "No file selected"}
                    </div>
                    <label className="ml-4 cursor-pointer">
                      <div className="flex items-center px-4 py-2 bg-black/60 border border-white/10 rounded-lg text-white hover:bg-white/10">
                        <Upload size={18} className="mr-2" />
                        <span>Upload</span>
                      </div>
                      <input type="file" accept="video/*" onChange={handleTrailerFileChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </>
            )}

            {values.isSeries && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-white border-b border-white/10 pb-2">Seasons and Episodes</h3>
                {values.seasons.map((season, seasonIndex) => (
                  <div key={seasonIndex} className="p-4 bg-black/20 border border-white/10 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        value={season.name}
                        onChange={(e) => handleSeasonNameChange(seasonIndex, e.target.value)}
                        className="px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeSeason(seasonIndex)}
                        className="p-1 text-gray-400 hover:text-red-500"
                        disabled={values.seasons.length === 1}
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="space-y-3 ml-4">
                      {season.episodes.map((episode, episodeIndex) => (
                        <div key={episodeIndex} className="flex items-center">
                          <input
                            type="text"
                            value={episode.name}
                            onChange={(e) => handleEpisodeNameChange(seasonIndex, episodeIndex, e.target.value)}
                            className="w-1/3 px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mr-2"
                            placeholder="Episode name"
                          />
                          <div className="flex-1 flex items-center">
                            <div className="flex-1 px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-white overflow-hidden text-ellipsis whitespace-nowrap">
                              {episode.videoFile ? episode.videoFile.name : "No file selected"}
                            </div>
                            <label className="ml-2 cursor-pointer">
                              <div className="flex items-center px-3 py-1 bg-black/60 border border-white/10 rounded-lg text-white hover:bg-white/10">
                                <Upload size={16} className="mr-1" />
                                <span className="text-sm">Upload</span>
                              </div>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => handleEpisodeFileChange(seasonIndex, episodeIndex, e)}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => removeEpisode(seasonIndex, episodeIndex)}
                              className="ml-2 p-1 text-gray-400 hover:text-red-500"
                              disabled={season.episodes.length === 1}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => addEpisode(seasonIndex)}
                        className="flex items-center text-sm text-purple-400 hover:text-purple-300"
                      >
                        <Plus size={14} className="mr-1" />
                        Add Episode
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSeason}
                  className="flex items-center text-sm text-purple-400 hover:text-purple-300"
                >
                  <Plus size={16} className="mr-1" />
                  Add Season
                </button>
              </div>
            )}

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={values.status}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin/movies")}
            className="px-6 py-2 border border-white/10 rounded-lg text-white hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={values.isSubmitting}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white flex items-center"
          >
            {values.isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              `Save ${values.isSeries ? "Series" : "Movie"}`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMovie;