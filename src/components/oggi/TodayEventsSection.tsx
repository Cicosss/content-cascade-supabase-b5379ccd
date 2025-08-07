
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
    <section className="relative">
      <div className="flex items-center justify-center mb-8 lg:mb-12">
        <div className="flex items-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-blue-400/30">
          <Calendar className="h-8 w-8 lg:h-10 lg:w-10 text-blue-400 mr-4 animate-pulse" />
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight">
            Eventi in Corso Oggi
          </h2>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-96 bg-gradient-to-br from-slate-700/50 to-slate-800/50 animate-pulse rounded-3xl border border-slate-600/50" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card className="relative p-8 lg:p-12 text-center bg-gradient-to-br from-slate-700/80 to-slate-800/90 backdrop-blur-sm border border-slate-600/50 rounded-3xl shadow-2xl">
          {/* 3D Relief Shadow */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-600/30 to-slate-800/20 rounded-3xl transform translate-x-1 translate-y-1 blur-sm -z-10"></div>
          
          <Calendar className="h-16 w-16 lg:h-20 lg:w-20 text-blue-400/60 mb-6 mx-auto animate-pulse" />
          <h3 className="font-playfair text-xl lg:text-2xl font-bold text-white mb-4">
            Nessun evento oggi
          </h3>
          <p className="font-lora text-base lg:text-lg text-slate-300">
            Non ci sono eventi programmati per oggi, ma controlla domani!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {events.map((event, index) => (
            <Card 
              key={event.id} 
              className="relative overflow-hidden bg-gradient-to-br from-slate-700/90 to-slate-800/95 backdrop-blur-sm border border-slate-600/50 rounded-3xl hover:scale-102 transition-all duration-300 transform will-change-transform shadow-2xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* 3D Relief Shadow Layers */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-600/30 to-slate-800/20 rounded-3xl transform translate-x-1 translate-y-1 blur-sm -z-10"></div>
              
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <span className="relative z-10 text-white font-playfair text-lg lg:text-xl font-bold">
                  🎉 {event.category}
                </span>
                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-twinkle"></div>
                <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-white/30 rounded-full animate-twinkle animation-delay-500"></div>
              </div>
              
              <CardContent className="p-6 lg:p-8">
                <Badge className="mb-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-lg animate-pulse">
                  OGGI
                </Badge>
                
                <h3 className="font-playfair text-xl lg:text-2xl font-bold text-white mb-3 leading-tight line-clamp-2">
                  {event.name}
                </h3>
                
                <p className="font-lora text-sm lg:text-base text-slate-300 mb-6 leading-relaxed line-clamp-2">
                  {event.description}
                </p>
                
                <div className="space-y-3 text-sm lg:text-base text-slate-300 mb-6">
                  <div className="flex items-center font-bold text-blue-400">
                    <Clock className="h-4 w-4 lg:h-5 lg:w-5 mr-3" />
                    <span className="font-lora">{formatTime(event.start_datetime)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 lg:h-5 lg:w-5 mr-3 text-slate-400" />
                    <span className="font-lora">{event.location_name || event.address}</span>
                  </div>
                </div>
                
                {event.price_info && (
                  <div className="font-playfair text-lg lg:text-xl font-bold text-green-400">
                    {event.price_info}
                  </div>
                )}
              </CardContent>
              
              {/* Additional floating particles */}
              <div className="absolute bottom-4 right-4 w-1 h-1 bg-blue-400/60 rounded-full animate-twinkle animation-delay-300"></div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default TodayEventsSection;
