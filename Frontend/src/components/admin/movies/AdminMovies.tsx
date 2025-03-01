import { useState, useEffect } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MovieUploadForm } from './MovieUploadForm';
import { adminService } from '@/services/adminService';

export function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const data = await adminService.getAllMovies();
    setMovies(data);
  };

  const handleDelete = async (movieId: string) => {
    await adminService.deleteMovie(movieId);
    fetchMovies();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2>Movies Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Upload Movie</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Movie</DialogTitle>
            </DialogHeader>
            <MovieUploadForm onSuccess={() => {
              setShowUploadDialog(false);
              fetchMovies();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Genre</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movies.map((movie: any) => (
            <TableRow key={movie._id}>
              <TableCell>{movie.title}</TableCell>
              <TableCell>{movie.genre}</TableCell>
              <TableCell>{movie.year}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => handleDelete(movie._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}