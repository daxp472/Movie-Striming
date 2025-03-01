import { useState, useEffect } from 'react';
import { Movie } from './interfaces/Movie';
import { movieService } from './services/movieService';
import { Button } from '@/components/Ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/Ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/Ui/dialog';
import { useToast } from '@/components/Ui/use-toast';

export function MovieManagement() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await fetch('http://localhost:3000/api/admin/movies').then(res => res.json());
      setMovies(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch movies',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId: string) => {
    try {
      await movieService.deleteMovie(movieId);
      fetchMovies();
      toast({
        title: 'Success',
        description: 'Movie deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete movie',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Movie Management</h2>
        <Button onClick={() => window.location.href = '/admin/movies/upload'}>
          Add New Movie
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Release Year</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movies.map((movie) => (
            <TableRow key={movie._id}>
              <TableCell>{movie.title}</TableCell>
              <TableCell>{movie.genre.join(', ')}</TableCell>
              <TableCell>{movie.releaseYear}</TableCell>
              <TableCell>{movie.isSeries ? 'Series' : 'Movie'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">View Details</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{movie.title}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <img src={movie.posterUrl} alt={movie.title} className="w-full max-h-48 object-cover rounded" />
                        <p>{movie.description}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <strong>Duration:</strong> {movie.duration}
                          </div>
                          <div>
                            <strong>Rating:</strong> {movie.rating}
                          </div>
                          {movie.isSeries && (
                            <>
                              <div>
                                <strong>Season:</strong> {movie.seasonNumber}
                              </div>
                              <div>
                                <strong>Episode:</strong> {movie.episodeNumber}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `/admin/movies/edit/${movie._id}`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteMovie(movie._id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}