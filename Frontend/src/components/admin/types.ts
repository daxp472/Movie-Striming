export interface User {
  id: string;
  name: string;
  email: string;
  canWatch: boolean;
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  genres: string[];
  releaseDate: string;
  duration: number;
}