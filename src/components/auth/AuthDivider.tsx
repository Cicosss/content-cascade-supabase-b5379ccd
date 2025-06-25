
import React from 'react';

export const AuthDivider: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative bg-white px-4">
        <span className="text-sm text-gray-500 font-medium">oppure</span>
      </div>
    </div>
  );
};
