import React, { useState } from 'react';
import axios from 'axios';

const AdminAddMoviePage: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    releaseDate: '',
    duration: '',
    languages: '',
    genres: '',
    trailerUrl: '',
    cloudinaryAccountId: '',
    isSeries: false,
    seasonNumber: '',
    episodeNumber: '',
    seriesId: '',
    thumbnail: null,
    video: null,
    subtitles: [],
    audioTracks: []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      await axios.post('http://localhost:3000/movies', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Movie added successfully');
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Add New Movie</h1>
      <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
        <div className="mb-4">
          <label className="block text-white mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
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
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Languages</label>
          <input
            type="text"
            name="languages"
            value={formData.languages}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Genres</label>
          <input
            type="text"
            name="genres"
            value={formData.genres}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Trailer URL</label>
          <input
            type="text"
            name="trailerUrl"
            value={formData.trailerUrl}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Cloudinary Account ID</label>
          <input
            type="text"
            name="cloudinaryAccountId"
            value={formData.cloudinaryAccountId}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Is Series</label>
          <input
            type="checkbox"
            name="isSeries"
            checked={formData.isSeries}
            onChange={() => setFormData({ ...formData, isSeries: !formData.isSeries })}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        {formData.isSeries && (
          <>
            <div className="mb-4">
              <label className="block text-white mb-2">Season Number</label>
              <input
                type="number"
                name="seasonNumber"
                value={formData.seasonNumber}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Episode Number</label>
              <input
                type="number"
                name="episodeNumber"
                value={formData.episodeNumber}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-white mb-2">Series ID</label>
              <input
                type="text"
                name="seriesId"
                value={formData.seriesId}
                onChange={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white"
              />
            </div>
          </>
        )}
        <div className="mb-4">
          <label className="block text-white mb-2">Thumbnail</label>
          <input
            type="file"
            name="thumbnail"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Video</label>
          <input
            type="file"
            name="video"
            onChange={handleFileChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />
        </div>
        <button type="submit" className="w-full p-2 rounded bg-purple-600 text-white">Add Movie</button>
      </form>
    </div>
  );
};

export default AdminAddMoviePage;