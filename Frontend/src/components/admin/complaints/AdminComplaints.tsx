import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/adminService';

export function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const data = await adminService.getAllComplaints();
    setComplaints(data);
  };

  const handleResolve = async (complaintId: string) => {
    await adminService.resolveComplaint(complaintId);
    fetchComplaints();
  };

  return (
    <div className="space-y-4">
      {complaints.map((complaint: any) => (
        <Card key={complaint._id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{complaint.subject}</h3>
                <p className="text-sm text-gray-600">{complaint.description}</p>
                <p className="text-xs text-gray-400">
                  Reported by: {complaint.userId}
                </p>
              </div>
              <Button 
                onClick={() => handleResolve(complaint._id)}
                disabled={complaint.status === 'resolved'}
              >
                {complaint.status === 'resolved' ? 'Resolved' : 'Resolve'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}