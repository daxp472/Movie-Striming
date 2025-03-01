import { useState, useEffect } from 'react';
import { UserComplaint } from './interfaces/User';
import { userService } from './services/userService';
import { Button } from '@/components/Ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter 
} from '@/components/Ui/dialog';
import { Textarea } from '@/components/Ui/textarea';
import { Badge } from '@/components/Ui/badge';
import { useToast } from '@/components/Ui/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Ui/select';

export function UserComplaints() {
  const [complaints, setComplaints] = useState<UserComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<UserComplaint | null>(null);
  const [response, setResponse] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await fetch('http://localhost:3000/api/admin/complaints').then(res => res.json());
      setComplaints(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch complaints',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId: string, status: 'pending' | 'resolved') => {
    try {
      await userService.handleComplaint(complaintId, {
        status,
        response: response || 'Status updated'
      });
      
      fetchComplaints();
      toast({
        title: 'Success',
        description: 'Complaint status updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update complaint status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'pending' ? 'yellow' : 'green';
  };

  if (loading) {
    return <div>Loading complaints...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Complaints</h2>
        <Select onValueChange={(value) => {
          const filtered = value === 'all' ? complaints 
            : complaints.filter(c => c.status === value);
          setComplaints(filtered);
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {complaints.map((complaint) => (
          <Card key={complaint._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{complaint.subject}</CardTitle>
                <Badge variant={getStatusColor(complaint.status)}>
                  {complaint.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{complaint.description}</p>
              <div className="flex justify-between items-center">
                <small className="text-muted-foreground">
                  Submitted on: {new Date(complaint.createdAt).toLocaleDateString()}
                </small>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Respond</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Respond to Complaint</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Response</label>
                        <Textarea
                          value={response}
                          onChange={(e) => setResponse(e.target.value)}
                          placeholder="Enter your response..."
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <DialogFooter className="flex justify-between mt-4">
                      <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate(complaint._id, 'pending')}
                      >
                        Mark as Pending
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(complaint._id, 'resolved')}
                      >
                        Resolve Complaint
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}