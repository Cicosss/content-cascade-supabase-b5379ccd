
import React from 'react';
import { CardHeader, CardDescription } from '@/components/ui/card';
import MiaRomagnaLogo from '@/components/MiaRomagnaLogo';

export const AuthHeader = () => {
  return (
    <CardHeader className="text-center pb-6">
      <div className="flex justify-center items-center mb-6">
        <MiaRomagnaLogo width={270} height={270} />
      </div>
      <div className="flex flex-col items-center space-y-3">
        <div className="w-20 h-px" style={{ backgroundColor: '#ffdd0e' }}></div>
        <CardDescription className="uppercase tracking-wider font-medium" style={{ color: '#0377f9' }}>
          Il territorio è tra le tue mani
        </CardDescription>
        <div className="w-20 h-px" style={{ backgroundColor: '#ffdd0e' }}></div>
      </div>
    </CardHeader>
  );
};
