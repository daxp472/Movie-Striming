export interface User {
    _id: string;
    email: string;
    name: string;
    status: 'active' | 'suspended';
    tier: 'free' | 'premium' | 'vip';
    createdAt: string;
  }
  
  export interface UserActivity {
    userId: string;
    action: string;
    timestamp: string;
    details: string;
  }
  
  export interface UserComplaint {
    userId: string;
    subject: string;
    description: string;
    status: 'pending' | 'resolved';
    createdAt: string;
  }