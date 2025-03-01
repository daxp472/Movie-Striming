"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"

const AdminEditMoviePage: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseDate: "",
    duration: "",
    languages: "",
    genres: "",
    trailerUrl: "",
    cloudinaryAccountId: "",
    isSeries: false,
    seasonNumber: "",
    episodeNumber: "",
    seriesId: "",
    thumbnail: null,
    video: null,
    subtitles: [],
    audioTracks: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Valid genres from the documentation
  const validGenres = [
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
  ]

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:3000/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        })

        // Convert arrays to comma-separated strings for form inputs
        const movieData = response.data
        setFormData({
          ...movieData,
          languages: Array.isArray(movieData.languages) ? movieData.languages.join(", ") : movieData.languages,
          genres: Array.isArray(movieData.genres) ? movieData.genres.join(", ") : movieData.genres,
          thumbnail: null, // Reset file inputs
          video: null,
          subtitles: [],
          audioTracks: [],
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching movie:", error)
        setError("Failed to load movie data. Please try again.")
        setLoading(false)
      }
    }

    fetchMovie()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target

    if (name === "subtitles" || name === "audioTracks") {
      // Handle multiple files for subtitles and audio tracks
      if (files) {
        const fileArray = Array.from(files)
        setFormData({ ...formData, [name]: fileArray })
      }
    } else {
      // Handle single file for thumbnail and video
      setFormData({ ...formData, [name]: files ? files[0] : null })
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData({ ...formData, [name]: checked })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      setLoading(true)
      const data = new FormData()

      // Append text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "languages" || key === "genres") {
          // Convert comma-separated strings to arrays
          const arrayValue = value
            .toString()
            .split(",")
            .map((item) => item.trim())
          data.append(key, JSON.stringify(arrayValue))
        } else if (key !== "thumbnail" && key !== "video" && key !== "subtitles" && key !== "audioTracks") {
          // Append other text fields if they have a value
          if (value !== null && value !== undefined) {
            data.append(key, value.toString())
          }
        }
      })

      // Append files
      if (formData.thumbnail) {
        data.append("thumbnail", formData.thumbnail)
      }

      if (formData.video) {
        data.append("video", formData.video)
      }

      // Append multiple files for subtitles
      if (formData.subtitles.length > 0) {
        formData.subtitles.forEach((file: File) => {
          data.append("subtitles", file)
        })
      }

      // Append multiple files for audio tracks
      if (formData.audioTracks.length > 0) {
        formData.audioTracks.forEach((file: File) => {
          data.append("audioTracks", file)
        })
      }

      await axios.put(`http://localhost:3000/movies/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          "Content-Type": "multipart/form-data",
        },
      })

      setSuccess("Movie updated successfully")
      setLoading(false)

      // Navigate back to movies list after short delay
      setTimeout(() => {
        navigate("/admin/movies")
      }, 2000)
    } catch (error) {
      console.error("Error updating movie:", error)
      setError("Failed to update movie. Please check your inputs and try again.")
      setLoading(false)
    }
  }

  if (loading && !formData.title) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Loading movie data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Edit Movie</h1>

      {error && <div className="bg-red-500/20 border border-red-500 text-white p-4 mb-6 rounded-lg">{error}</div>}

      {success && (
        <div className="bg-green-500/20 border border-green-500 text-white p-4 mb-6 rounded-lg">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <div className="mb-4">
          <label className="block text-white mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white min-h-[100px]"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Release Date</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            min="1"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Languages (comma-separated)</label>
          <input
            type="text"
            name="languages"
            value={formData.languages}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="English, Hindi, Spanish"
            required
          />
          <p className="text-gray-400 text-xs mt-1">Enter languages separated by commas</p>
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Genres (comma-separated)</label>
          <input
            type="text"
            name="genres"
            value={formData.genres}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="Action, Drama, Thriller"
            required
          />
          <p className="text-gray-400 text-xs mt-1">Valid genres: {validGenres.join(", ")}</p>
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Trailer URL</label>
          <input
            type="text"
            name="trailerUrl"
            value={formData.trailerUrl}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Cloudinary Account ID (1-5)</label>
          <select
            name="cloudinaryAccountId"
            value={formData.cloudinaryAccountId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            required
          >
            <option value="">Select Account</option>
            <option value="1">Account 1</option>
            <option value="2">Account 2</option>
            <option value="3">Account 3</option>
            <option value="4">Account 4</option>
            <option value="5">Account 5</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center text-white mb-2">
            <input
              type="checkbox"
              name="isSeries"
              checked={formData.isSeries}
              onChange={handleCheckboxChange}
              className="mr-2 rounded bg-gray-800"
            />
            Is Series
          </label>
        </div>

        {formData.isSeries && (
          <div className="mb-4 p-4 border border-white/10 rounded-lg">
            <h3 className="text-white text-lg mb-3">Series Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Season Number</label>
                <input
                  type="number"
                  name="seasonNumber"
                  value={formData.seasonNumber}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  min="1"
                  required={formData.isSeries}
                />
              </div>
              <div>
                <label className="block text-white mb-2">Episode Number</label>
                <input
                  type="number"
                  name="episodeNumber"
                  value={formData.episodeNumber}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white"
                  min="1"
                  required={formData.isSeries}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-white mb-2">Series ID</label>
              <input
                type="text"
                name="seriesId"
                value={formData.seriesId}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
                required={formData.isSeries}
              />
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-white mb-2">Thumbnail</label>
          <input
            type="file"
            name="thumbnail"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            accept="image/*"
          />
          <p className="text-gray-400 text-xs mt-1">Leave empty to keep current thumbnail</p>
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Video</label>
          <input
            type="file"
            name="video"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            accept="video/*"
          />
          <p className="text-gray-400 text-xs mt-1">Leave empty to keep current video</p>
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Subtitles (max 10 files)</label>
          <input
            type="file"
            name="subtitles"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            accept=".vtt,.srt"
            multiple
          />
          <p className="text-gray-400 text-xs mt-1">
            Selected files:{" "}
            {formData.subtitles.length > 0 ? formData.subtitles.map((file: File) => file.name).join(", ") : "None"}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-white mb-2">Audio Tracks (max 5 files)</label>
          <input
            type="file"
            name="audioTracks"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            accept="audio/*"
            multiple
          />
          <p className="text-gray-400 text-xs mt-1">
            Selected files:{" "}
            {formData.audioTracks.length > 0 ? formData.audioTracks.map((file: File) => file.name).join(", ") : "None"}
          </p>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate("/admin/movies")}
            className="px-6 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Movie"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminEditMoviePage;