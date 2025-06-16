
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, CheckCircle, Eye } from 'lucide-react';

interface POISubmission {
  id: string;
  status: string;
}

interface PromoterStatsProps {
  submissions: POISubmission[];
}

const PromoterStats: React.FC<PromoterStatsProps> = ({ submissions }) => {
  const approvedCount = submissions.filter(sub => sub.status === 'approved').length;
  
  const getPromoterLevel = (approvedCount: number) => {
    if (approvedCount >= 31) {
      return { level: 'Promotore Oro', color: 'bg-yellow-100 text-yellow-800', icon: '🏆' };
    } else if (approvedCount >= 11) {
      return { level: 'Promotore Argento', color: 'bg-gray-100 text-gray-800', icon: '🥈' };
    } else {
      return { level: 'Promotore Bronzo', color: 'bg-orange-100 text-orange-800', icon: '🥉' };
    }
  };

  const promoterLevel = getPromoterLevel(approvedCount);
  
  // Mock data for total views - in a real implementation this would come from analytics
  const totalViews = approvedCount * 127; // Simulated views per approved POI

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Proposte Approvate */}
      <Card className="text-center">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-center gap-2 text-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Proposte Approvate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600 mb-2">{approvedCount}</div>
          <p className="text-sm text-slate-600">
            {approvedCount === 0 ? 'Inizia a proporre!' : 'Ottimo lavoro!'}
          </p>
        </CardContent>
      </Card>

      {/* Livello Promotore */}
      <Card className="text-center">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-amber-600" />
            Livello Promotore
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-3">
            <span className="text-3xl mr-2">{promoterLevel.icon}</span>
            <Badge className={`${promoterLevel.color} text-base font-semibold px-3 py-1`}>
              {promoterLevel.level}
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
            {approvedCount < 11 ? `${11 - approvedCount} per Argento` : 
             approvedCount < 31 ? `${31 - approvedCount} per Oro` : 
             'Livello massimo raggiunto!'}
          </p>
        </CardContent>
      </Card>

      {/* Visualizzazioni Totali */}
      <Card className="text-center">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-blue-600" />
            Visualizzazioni Totali
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {totalViews.toLocaleString('it-IT')}
          </div>
          <p className="text-sm text-slate-600">
            {approvedCount === 0 ? 'In attesa di proposte' : 'Impatto sui visitatori'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoterStats;
