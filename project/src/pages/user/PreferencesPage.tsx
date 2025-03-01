import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
  'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western'
];

const languages = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Japanese', 'Korean', 'Chinese'];

const PreferencesPage: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Action', 'Sci-Fi']);
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedGenres.length === 0) {
      toast.error('Please select at least one genre');
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Preferences updated successfully');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Preferences</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Content Preferences */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Content Preferences</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Genres
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {genres.map((genre) => (
                    <div key={genre} className="flex items-center">
                      <input
                        id={`genre-${genre}`}
                        type="checkbox"
                        checked={selectedGenres.includes(genre)}
                        onChange={() => toggleGenre(genre)}
                        className="h-4 w-4 bg-black/40 border-white/10 rounded text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor={`genre-${genre}`} className="ml-2 text-sm text-gray-300">
                        {genre}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-2">
                  Preferred Language
                </label>
                <select
                  id="language"
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="block w-full px-3 py-2 bg-black/40 border border-white/10 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Playback Settings */}
          <div className="bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Playback Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Subtitles</h3>
                  <p className="text-xs text-gray-400">Show subtitles during playback</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subtitlesEnabled}
                    onChange={() => setSubtitlesEnabled(!subtitlesEnabled)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Autoplay</h3>
                  <p className="text-xs text-gray-400">Automatically play next episode</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoplayEnabled}
                    onChange={() => setAutoplayEnabled(!autoplayEnabled)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-white">Notifications</h3>
                  <p className="text-xs text-gray-400">Receive notifications about new content</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 disabled:opacity-70"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreferencesPage;