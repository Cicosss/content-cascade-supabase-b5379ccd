
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import MiaRomagnaLogo from '@/components/MiaRomagnaLogo';

export const AuthHeader = () => {
  return (
    <CardHeader className="text-center pb-6">
      <div className="flex justify-center mb-4">
        <MiaRomagnaLogo width={80} height={80} />
      </div>
      <CardDescription className="text-slate-600">
        Il territorio è tra le tue mani
      </CardDescription>
    </CardHeader>
  );
};
