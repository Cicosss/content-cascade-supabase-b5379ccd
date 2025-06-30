
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { formatTime } from '@/utils/dateUtils';

interface Event {
  id: string;
  name: string;
  description: string;
  start_datetime: string;
  end_datetime?: string;
  location_name?: string;
  address?: string;
  category?: string;
  price_info?: string;
  poi_type?: string;
}

interface TodayEventsSectionProps {
  events: Event[];
  loading: boolean;
}

const TodayEventsSection: React.FC<TodayEventsSectionProps> = ({ events, loading }) => {
  return (
    <section>
      <div className="flex items-center mb-6">
        <Calendar className="h-8 w-8 text-blue-900 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Eventi in Corso Oggi</h2>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-80 bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card className="p-8 text-left">
          <Calendar className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Nessun evento oggi</h3>
          <p className="text-gray-500">Non ci sono eventi programmati per oggi, ma controlla domani!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                <span className="text-white text-sm">🎉 {event.category}</span>
              </div>
              <CardContent className="p-4">
                <Badge className="mb-2 bg-blue-100 text-blue-800">OGGI</Badge>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {event.description}
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center font-semibold text-blue-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatTime(event.start_datetime)}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location_name || event.address}
                  </div>
                </div>
                {event.price_info && (
                  <div className="text-lg font-semibold text-green-600">
                    {event.price_info}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default TodayEventsSection;
