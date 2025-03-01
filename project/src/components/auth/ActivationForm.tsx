import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ActivationFormProps {
  onActivationStart: () => void;
  onActivationEnd: () => void;
  className?: string;
}

const ActivationForm: React.FC<ActivationFormProps> = ({ 
  onActivationStart, 
  onActivationEnd,
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !activationCode) {
      toast.error('Please fill in all fields');
      return;
    }
    
    onActivationStart();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Account activated successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Invalid activation code');
    } finally {
      onActivationEnd();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-black/40 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="you@example.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="activationCode" className="block text-sm font-medium text-gray-300">
            Activation Code
          </label>
          <input
            id="activationCode"
            type="text"
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-black/40 border border-white/10 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Enter the code from your email"
            required
          />
        </div>
        
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-900"
          >
            Activate Account
          </button>
        </div>
      </div>
    </form>
  );
};

export default ActivationForm;