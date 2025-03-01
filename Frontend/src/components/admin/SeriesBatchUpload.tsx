import { useState } from 'react';
import { movieService } from './services/movieService';
import { Button } from '@/components/Ui/button';
import { Input } from '@/components/Ui/input';
import { useToast } from '@/components/Ui/use-toast';
import { Card, CardContent } from '@/components/Ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface EpisodeForm {
  episodeNumber: string;
  title: string;
  videoFile: File | null;
}

export function SeriesBatchUpload() {
  const [seriesTitle, setSeriesTitle] = useState('');
  const [seasonNumber, setSeasonNumber] = useState('');
  const [episodes, setEpisodes] = useState<EpisodeForm[]>([
    { episodeNumber: '1', title: '', videoFile: null }
  ]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const addEpisode = () => {
    setEpisodes([
      ...episodes,
      {
        episodeNumber: (episodes.length + 1).toString(),
        title: '',
        videoFile: null
      }
    ]);
  };

  const removeEpisode = (index: number) => {
    setEpisodes(episodes.filter((_, i) => i !== index));
  };

  const updateEpisode = (index: number, field: keyof EpisodeForm, value: string | File | null) => {
    const updatedEpisodes = [...episodes];
    updatedEpisodes[index] = {
      ...updatedEpisodes[index],
      [field]: value
    };
    setEpisodes(updatedEpisodes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!seriesTitle || !seasonNumber || episodes.some(ep => !ep.title || !ep.videoFile)) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('seriesTitle', seriesTitle);
      formData.append('seasonNumber', seasonNumber);
      
      episodes.forEach((episode, index) => {
        formData.append(`episodes[${index}][episodeNumber]`, episode.episodeNumber);
        formData.append(`episodes[${index}][title]`, episode.title);
        if (episode.videoFile) {
          formData.append(`episodes[${index}][video]`, episode.videoFile);
        }
      });

      await movieService.uploadSeriesBatch(formData);
      
      toast({
        title: 'Success',
        description: 'Series batch uploaded successfully',
      });

      // Reset form
      setSeriesTitle('');
      setSeasonNumber('');
      setEpisodes([{ episodeNumber: '1', title: '', videoFile: null }]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload series batch',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 mb-6">
          <div>
            <label className="block mb-2">Series Title</label>
            <Input
              value={seriesTitle}
              onChange={(e) => setSeriesTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Season Number</label>
            <Input
              type="number"
              value={seasonNumber}
              onChange={(e) => setSeasonNumber(e.target.value)}
              required
              min="1"
            />
          </div>
        </div>

        <div className="space-y-4">
          {episodes.map((episode, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2">
                    <Input
                      type="number"
                      value={episode.episodeNumber}
                      onChange={(e) => updateEpisode(index, 'episodeNumber', e.target.value)}
                      placeholder="Ep #"
                      required
                      min="1"
                    />
                  </div>
                  <div className="col-span-4">
                    <Input
                      value={episode.title}
                      onChange={(e) => updateEpisode(index, 'title', e.target.value)}
                      placeholder="Episode Title"
                      required
                    />
                  </div>
                  <div className="col-span-5">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) => updateEpisode(index, 'videoFile', e.target.files?.[0] || null)}
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    {episodes.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeEpisode(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <Button type="button" variant="outline" onClick={addEpisode}>
            <Plus className="h-4 w-4 mr-2" />
            Add Episode
          </Button>
          <Button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Series Batch'}
          </Button>
        </div>
      </form>
    </div>
  );
}