
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import NearbyPOIsSection from '@/components/poi/NearbyPOIsSection';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Euro, Phone, Mail, Globe, ArrowLeft } from 'lucide-react';

interface POIData {
  id: string;
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  images: string[];
  price_info?: string;
  duration_info?: string;
  opening_hours?: string;
  phone?: string;
  email?: string;
  website_url?: string;
  target_audience: string;
}

const POIDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poi, setPoi] = useState<POIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPOI = async () => {
      if (!id) return;

      try {
        console.log('🔍 Caricamento dettagli POI:', id);
        
        const { data, error } = await supabase
          .from('points_of_interest')
          .select('*')
          .eq('id', id)
          .eq('status', 'approved')
          .single();

        if (error) {
          console.error('❌ Errore nel caricamento POI:', error);
          setError('POI non trovato');
          return;
        }

        console.log('✅ POI caricato:', data.name);
        setPoi(data);
      } catch (error) {
        console.error('❌ Errore inaspettato:', error);
        setError('Errore nel caricamento del POI');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPOI();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !poi) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">POI non trovato</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Torna alla Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const coverImage = poi.images && poi.images.length > 0 ? poi.images[0] : null;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Indietro
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="aspect-[4/3] relative overflow-hidden rounded-2xl bg-gray-100">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt={poi.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl opacity-50">📍</span>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <Badge className="mb-3">{poi.category}</Badge>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{poi.name}</h1>
                  {poi.description && (
                    <p className="text-gray-600 leading-relaxed">{poi.description}</p>
                  )}
                </div>

                <div className="space-y-4">
                  {poi.address && (
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{poi.address}</span>
                    </div>
                  )}

                  {poi.opening_hours && (
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{poi.opening_hours}</span>
                    </div>
                  )}

                  {poi.price_info && (
                    <div className="flex items-start">
                      <Euro className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{poi.price_info}</span>
                    </div>
                  )}

                  {poi.phone && (
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      <a href={`tel:${poi.phone}`} className="text-blue-600 hover:text-blue-700">
                        {poi.phone}
                      </a>
                    </div>
                  )}

                  {poi.email && (
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      <a href={`mailto:${poi.email}`} className="text-blue-600 hover:text-blue-700">
                        {poi.email}
                      </a>
                    </div>
                  )}

                  {poi.website_url && (
                    <div className="flex items-start">
                      <Globe className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      <a 
                        href={poi.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Visita il sito web
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nearby POIs Section - Caricamento Lazy */}
        <NearbyPOIsSection 
          currentPOI={{
            id: poi.id,
            latitude: poi.latitude,
            longitude: poi.longitude
          }}
        />
      </div>
    </Layout>
  );
};

export default POIDetail;
