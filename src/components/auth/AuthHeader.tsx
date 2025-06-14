
import React from 'react';
import { CardHeader, CardDescription } from '@/components/ui/card';
import MiaRomagnaLogo from '@/components/MiaRomagnaLogo';

export const AuthHeader = () => {
  return (
    <CardHeader className="text-center pb-6">
      <div className="flex justify-center items-center mb-6">
        <MiaRomagnaLogo width={180} height={180} />
      </div>
      <div className="flex flex-col items-center space-y-3">
        <div className="w-20 h-px bg-blue-900"></div>
        <CardDescription className="text-blue-900 uppercase tracking-wider font-medium">
          Il territorio è tra le tue mani
        </CardDescription>
        <div className="w-20 h-px bg-blue-900"></div>
      </div>
    </CardHeader>
  );
};
