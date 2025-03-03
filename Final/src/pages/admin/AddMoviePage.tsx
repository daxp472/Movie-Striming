import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { createMovie, checkAvailableSlots } from '@/lib/api';
import { Button } from '@/components/ui/button';
import MovieForm from '@/components/MovieForm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const AddMoviePage: React.FC = () => {
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

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const availableSlots = await checkAvailableSlots();
      if (availableSlots <= 0) {
        toast({
          variant: "destructive",
          title: "Upload Failed",
          description: "No available slots for uploading movies.",
        });
        return;
      }
      await createMovie(formData);
      
      toast({
        title: "Movie added",
        description: "The movie has been added successfully.",
      });
      
      navigate('/admin');
    } catch (error: any) {
      console.error('Error adding movie:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to add movie. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-3xl font-bold">Add New Movie</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <MovieForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  );
};

export default AddMoviePage;