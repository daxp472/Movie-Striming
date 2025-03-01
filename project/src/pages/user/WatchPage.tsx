import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Subtitles, Settings } from 'lucide-react'; // Assuming Lucide icons

const WatchPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress] = useState(0.5); // Example value, replace with real logic
  const [showSubtitlesMenu, setShowSubtitlesMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState('');
  const [selectedQuality, setSelectedQuality] = useState('1080p'); // Example

  // Mock movie data (replace with real data)
  const movie = {
    subtitles: [{ language: 'English' }, { language: 'Spanish' }],
    quality: { '1080p': '', '720p': '' },
    audioTracks: [{ language: 'English' }, { language: 'Spanish' }],
  };

  const toggleSubtitlesMenu = () => setShowSubtitlesMenu(!showSubtitlesMenu);
  const toggleQualityMenu = () => setShowQualityMenu(!showQualityMenu);

  return (
    <div>
      <div>
        {!isPlaying && (
          <button
            onClick={() => setIsPlaying(true)}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-600/80 text-white pointer-events-auto transition-transform hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </button>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="space-y-4">
        {/* Progress Bar */}
        <div className="relative h-1 w-full bg-white/30 rounded-full overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-purple-600" style={{ width: `${progress * 100}%` }}></div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-purple-400">
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <div className="flex items-center space-x-2">
              <button className="text-white hover:text-purple-400">
                <ThumbsUp size={20} />
              </button>
              <button className="text-white hover:text-purple-400">
                <ThumbsDown size={20} />
              </button>
            </div>

            <div className="text-sm text-white">
              <span>1:15:30 / 2:28:00</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button onClick={toggleSubtitlesMenu} className="text-white hover:text-purple-400">
                <Subtitles size={20} />
              </button>

              {showSubtitlesMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-48 rounded-md bg-black/90 backdrop-blur-md border border-white/10 p-2 shadow-lg">
                  <div className="py-1">
                    <p className="px-3 py-1 text-xs font-medium text-gray-400">Subtitles</p>
                    {movie.subtitles.map((subtitle) => (
                      <button
                        key={subtitle.language}
                        onClick={() => setSelectedSubtitle(subtitle.language)}
                        className={`block w-full px-3 py-2 text-left text-sm ${
                          selectedSubtitle === subtitle.language
                            ? 'bg-purple-600/30 text-white'
                            : 'text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {subtitle.language}
                      </button>
                    ))}
                    <button
                      onClick={() => setSelectedSubtitle('')}
                      className={`block w-full px-3 py-2 text-left text-sm ${
                        !selectedSubtitle ? 'bg-purple-600/30 text-white' : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      Off
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={toggleQualityMenu} className="text-white hover:text-purple-400">
                <Settings size={20} />
              </button>

              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 w-48 rounded-md bg-black/90 backdrop-blur-md border border-white/10 p-2 shadow-lg">
                  <div className="py-1">
                    <p className="px-3 py-1 text-xs font-medium text-gray-400">Quality</p>
                    {Object.keys(movie.quality).map((quality) => (
                      <button
                        key={quality}
                        onClick={() => setSelectedQuality(quality)}
                        className={`block w-full px-3 py-2 text-left text-sm ${
                          selectedQuality === quality ? 'bg-purple-600/30 text-white' : 'text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-white/10 py-1 mt-1">
                    <p className="px-3 py-1 text-xs font-medium text-gray-400">Audio</p>
                    {movie.audioTracks.map((track) => (
                      <button
                        key={track.language}
                        className="block w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-white/10"
                      >
                        {track.language}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;