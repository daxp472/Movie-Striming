import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserActivity } from './interfaces/User';
import { userService } from './services/userService';
import { Card, CardContent } from '@/components/Ui/card';
import { ScrollArea } from '@/components/Ui/scroll-area';
import { useToast } from '@/components/Ui/use-toast';

export function UserActivityView() {
  const { userId } = useParams();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchUserActivity(userId);
    }
  }, [userId]);

  const fetchUserActivity = async (id: string) => {
    try {
      const data = await userService.getUserActivity(id);
      setActivities(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch user activity',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading activity history...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Activity History</h2>
      
      <ScrollArea className="h-[600px] rounded-md border p-4">
        {activities.length === 0 ? (
          <p className="text-center text-muted-foreground">No activity recorded</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{activity.action}</h3>
                    <time className="text-sm text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </time>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}