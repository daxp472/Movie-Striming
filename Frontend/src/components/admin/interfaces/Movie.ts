export interface Movie {
    _id: string;
    title: string;
    description: string;
    genre: string[];
    releaseYear: number;
    duration: string;
    rating: number;
    posterUrl: string;
    videoUrl: string;
    isSeries: boolean;
    seasonNumber?: number;
    episodeNumber?: number;
  }
  
  export interface SeriesBatch {
    seriesTitle: string;
    seasonNumber: number;
    episodes: {
      episodeNumber: number;
      title: string;
      videoUrl: string;
    }[];
  }