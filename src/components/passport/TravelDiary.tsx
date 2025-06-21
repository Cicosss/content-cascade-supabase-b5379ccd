
import React from 'react';
import { Card } from '@/components/ui/card';
import { useUserVisits } from '@/hooks/useUserVisits';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const TravelDiary: React.FC = () => {
  const { getRecentVisits, loading } = useUserVisits();
  const navigate = useNavigate();
  const recentVisits = getRecentVisits(10);

  if (loading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-slate-900">Il Tuo Diario di Viaggio</h2>
        <div className="text-center text-gray-500">Caricamento...</div>
      </Card>
    );
  }

  if (recentVisits.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4 text-slate-900">Il Tuo Diario di Viaggio</h2>
        <div className="text-center text-gray-500 py-8">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Nessuna visita ancora registrata</p>
          <p className="text-sm">Inizia a esplorare e registra le tue visite!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4 text-slate-900">Il Tuo Diario di Viaggio</h2>
      <p className="text-slate-600 mb-6">Le tue ultime avventure in Romagna</p>
      
      <div className="space-y-4">
        {recentVisits.map((visit) => (
          <div
            key={visit.id}
            onClick={() => navigate(`/poi/${visit.poi_id}`)}
            className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-white"
          >
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {visit.poi_data?.images && visit.poi_data.images.length > 0 ? (
                <img
                  src={visit.poi_data.images[0]}
                  alt={visit.poi_data.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <MapPin className="h-6 w-6" />
                </div>
              )}
            </div>
            
            <div className="flex-grow min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">
                {visit.poi_data?.name || 'Nome non disponibile'}
              </h3>
              <p className="text-sm text-slate-600 truncate">
                {visit.poi_data?.category || 'Categoria non disponibile'}
              </p>
              <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                <Calendar className="h-3 w-3" />
                <span>
                  Visitato il {format(new Date(visit.visit_timestamp), 'd MMMM yyyy', { locale: it })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {recentVisits.length === 10 && (
        <div className="text-center mt-4">
          <p className="text-sm text-slate-500">Mostrando le ultime 10 visite</p>
        </div>
      )}
    </Card>
  );
};

export default TravelDiary;
