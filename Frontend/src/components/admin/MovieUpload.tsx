import { useState } from 'react';
import { movieService } from './services/movieService';
import { Button } from '@/components/Ui/button';
import { Input } from '@/components/Ui/input';
import { Textarea } from '@/components/Ui/textarea';
import { useToast } from '@/components/Ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Ui/tabs';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/Ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  genre: z.string().min(1, 'Genre is required'),
  releaseYear: z.string().regex(/^\d{4}$/, 'Must be a valid year'),
  duration: z.string().min(1, 'Duration is required'),
  rating: z.string().regex(/^\d(\.\d)?$/, 'Must be a number between 0-10'),
  isSeries: z.boolean().default(false),
  seasonNumber: z.string().optional(),
  episodeNumber: z.string().optional(),
});

export function MovieUpload() {
  const [uploading, setUploading] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: '',
      description: '',
      genre: '',
      releaseYear: '',
      duration: '',
      rating: '',
      isSeries: false,
      seasonNumber: '',
      episodeNumber: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof movieSchema>) => {
    if (!posterFile || !videoFile) {
      toast({
        title: 'Error',
        description: 'Please select both poster and video files',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      formData.append('poster', posterFile);
      formData.append('video', videoFile);

      await movieService.createMovie(formData);
      
      toast({
        title: 'Success',
        description: 'Movie uploaded successfully',
      });
      form.reset();
      setPosterFile(null);
      setVideoFile(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload movie',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upload Movie</h2>
      
      <Tabs defaultValue="single">
        <TabsList>
          <TabsTrigger value="single">Single Upload</TabsTrigger>
          <TabsTrigger value="series">Series Batch</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Genre</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="releaseYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Release Year</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" min="1900" max="2099" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>Poster Image</FormLabel>
                  <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
                  />
                </FormItem>

                <FormItem>
                  <FormLabel>Video File</FormLabel>
                  <Input 
                    type="file" 
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  />
                </FormItem>
              </div>

              <Button type="submit" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Movie'}
              </Button>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="series">
          <SeriesBatchUpload />
        </TabsContent>
      </Tabs>
    </div>
  );
}