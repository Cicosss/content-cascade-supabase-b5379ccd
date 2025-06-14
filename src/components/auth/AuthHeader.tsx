
import React from 'react';
import { CardHeader, CardDescription } from '@/components/ui/card';
import MiaRomagnaLogo from '@/components/MiaRomagnaLogo';

export const AuthHeader = () => {
  return (
    <CardHeader className="text-center pb-6">
      <div className="flex justify-center mb-4">
        <MiaRomagnaLogo width={120} height={120} />
      </div>
      <CardDescription className="text-slate-600">
        Il territorio è tra le tue mani
      </CardDescription>
    </CardHeader>
  );
};
