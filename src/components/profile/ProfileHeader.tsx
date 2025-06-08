
import React from 'react';
import { User } from 'lucide-react';

export const ProfileHeader = () => {
  return (
    <div className="flex items-center mb-8">
      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4">
        <User className="h-6 w-6 text-white" />
      </div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
        Il Mio Profilo
      </h1>
    </div>
  );
};
