import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getMovie, updateMovie } from '@/lib/api';
import { Movie } from '@/types';
import { Button } from '@/components/ui/button';
import MovieForm from '@/components/MovieForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const EditMoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="mb-6">You don't have permission to access this page.</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      
      try {
        const response = await getMovie(id);
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load movie. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [id, toast]);

  const handleSubmit = async (formData: FormData) => {
    if (!id) return;
    
    try {
      setIsSubmitting(true);
      await updateMovie(id, formData);
      
      toast({
        title: "Movie updated",
        description: "The movie has been updated successfully.",
      });
      
      navigate('/admin');
    } catch (error: any) {
      console.error('Error updating movie:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to update movie. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            className="mr-4"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Edit Movie</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
        <p className="mb-6">The movie you're trying to edit doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/admin')}>Back to Admin Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4"
          onClick={() => navigate('/admin')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Edit Movie: {movie.title}</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <MovieForm movie={movie} onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  );
};

export default EditMoviePage;