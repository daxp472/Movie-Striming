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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center bg-black/30 p-8 rounded-2xl border border-white/20 backdrop-blur-md shadow-lg max-w-md">
          <h2 className="text-3xl font-bold text-white drop-shadow-md mb-4">
            Access Denied
          </h2>
          <p className="text-gray-300 font-light mb-6">
            You don’t have permission to access this page.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-[0_0_8px_rgba(168,85,247,0.4)] transition-all duration-300"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const availableSlots = await checkAvailableSlots();
      if (availableSlots <= 0) {
        toast({
          variant: 'destructive',
          title: 'Upload Failed',
          description: 'No available slots for uploading movies.',
        });
        return;
      }
      await createMovie(formData);

      toast({
        title: 'Movie added',
        description: 'The movie has been added successfully.',
      });

      navigate('/admin');
    } catch (error: any) {
      console.error('Error adding movie:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add movie. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-4 rounded-xl bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:shadow-[0_0_8px_rgba(168,85,247,0.4)] transition-all duration-300"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-md">
              Add New Movie
            </h1>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg shadow-black/50 p-6">
          <MovieForm
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            className="text-white" // Ensure MovieForm text is white
          />
        </div>
      </div>
    </div>
  );
};

export default AddMoviePage;