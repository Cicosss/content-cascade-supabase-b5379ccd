import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Eye, Trash2, MapPin, Calendar, Globe, Phone, Edit } from 'lucide-react';
import ModerationFilters from './ModerationFilters';
import EditExperienceModal from './EditExperienceModal';

interface ApprovedExperience {
  id: string;
  name: string;
  description: string;
  poi_type: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  price_info: string;
  duration_info: string;
  target_audience: string;
  images: string[];
  video_url: string;
  phone: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  organizer_info: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const ApprovedExperiencesPanel = () => {
  const [experiences, setExperiences] = useState<ApprovedExperience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<ApprovedExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExperience, setEditingExperience] = useState<ApprovedExperience | null>(null);
  
  const [filters, setFilters] = useState({
    status: 'tutti',
    category: 'tutti',
    poiType: 'tutti',
    searchTerm: ''
  });

  useEffect(() => {
    fetchApprovedExperiences();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [experiences, filters]);

  const fetchApprovedExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching approved experiences:', error);
        toast.error('Errore nel caricamento delle esperienze approvate');
        return;
      }

      setExperiences(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nel caricamento delle esperienze approvate');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...experiences];

    // Filtro per status
    if (filters.status !== 'tutti') {
      filtered = filtered.filter(exp => exp.status === filters.status);
    }

    // Filtro per categoria
    if (filters.category !== 'tutti') {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }

    // Filtro per tipo POI
    if (filters.poiType !== 'tutti') {
      filtered = filtered.filter(exp => exp.poi_type === filters.poiType);
    }

    // Filtro per ricerca testuale
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(exp => 
        exp.name.toLowerCase().includes(searchLower) ||
        (exp.description && exp.description.toLowerCase().includes(searchLower)) ||
        (exp.address && exp.address.toLowerCase().includes(searchLower))
      );
    }

    setFilteredExperiences(filtered);
  };

  const deleteExperience = async (experienceId: string) => {
    try {
      const { error } = await supabase
        .from('points_of_interest')
        .delete()
        .eq('id', experienceId);

      if (error) {
        console.error('Error deleting experience:', error);
        toast.error('Errore nell\'eliminazione dell\'esperienza');
        return;
      }

      setExperiences(prev => prev.filter(exp => exp.id !== experienceId));
      toast.success('Esperienza eliminata con successo');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nell\'eliminazione dell\'esperienza');
    }
  };

  const handleEdit = (experience: ApprovedExperience) => {
    setEditingExperience(experience);
  };

  const handleEditClose = () => {
    setEditingExperience(null);
  };

  const handleEditSave = (updatedExperience: ApprovedExperience) => {
    setExperiences(prev => 
      prev.map(exp => 
        exp.id === updatedExperience.id ? updatedExperience : exp
      )
    );
    setEditingExperience(null);
  };

  const handleDelete = (experience: ApprovedExperience) => {
    if (window.confirm(`Sei sicuro di voler eliminare l'esperienza "${experience.name}"? Questa azione non può essere annullata.`)) {
      deleteExperience(experience.id);
    }
  };

  const getFilterSummary = () => {
    const activeFilters = [];
    if (filters.status !== 'tutti') activeFilters.push(`Status: ${filters.status}`);
    if (filters.category !== 'tutti') activeFilters.push(`Categoria: ${filters.category}`);
    if (filters.poiType !== 'tutti') activeFilters.push(`Tipo: ${filters.poiType}`);
    if (filters.searchTerm) activeFilters.push(`Ricerca: "${filters.searchTerm}"`);
    
    return activeFilters.length > 0 ? activeFilters.join(' • ') : 'Nessun filtro attivo';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Caricamento esperienze approvate...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
          <Eye className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Esperienze Approvate nel Database
        </h2>
      </div>
      
      {/* Filtri */}
      <ModerationFilters filters={filters} setFilters={setFilters} />
      
      {/* Riepilogo filtri e contatori */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Filtri attivi: {getFilterSummary()}</p>
            <p className="text-lg font-semibold text-green-800">
              Mostrando {filteredExperiences.length} di {experiences.length} esperienze
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Totale esperienze nel database: {experiences.length}
            </p>
          </div>
        </div>
      </Card>
      
      {/* Lista esperienze */}
      <div className="grid gap-6">
        {filteredExperiences.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {experiences.length === 0 
                  ? 'Nessuna esperienza trovata nel database' 
                  : 'Nessuna esperienza corrisponde ai filtri selezionati'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredExperiences.map((experience) => (
            <Card key={experience.id} className="w-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{experience.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      ID: {experience.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {experience.status || 'Approvata'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(experience)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(experience)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p><strong>Categoria:</strong> {experience.category}</p>
                    <p><strong>Tipo:</strong> {experience.poi_type}</p>
                    <p><strong>Target:</strong> {experience.target_audience}</p>
                    {experience.address && (
                      <p className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {experience.address}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    {experience.price_info && <p><strong>Prezzo:</strong> {experience.price_info}</p>}
                    {experience.duration_info && <p><strong>Durata:</strong> {experience.duration_info}</p>}
                    {experience.phone && (
                      <p className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {experience.phone}
                      </p>
                    )}
                  </div>
                </div>

                {experience.description && (
                  <div className="mb-4">
                    <strong>Descrizione:</strong>
                    <p className="text-sm text-muted-foreground mt-1">{experience.description}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 items-center">
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    Creata: {new Date(experience.created_at).toLocaleDateString('it-IT')}
                  </Badge>
                  
                  {experience.updated_at !== experience.created_at && (
                    <Badge variant="outline" className="text-xs">
                      <Edit className="h-3 w-3 mr-1" />
                      Aggiornata: {new Date(experience.updated_at).toLocaleDateString('it-IT')}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <EditExperienceModal
        experience={editingExperience}
        isOpen={!!editingExperience}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default ApprovedExperiencesPanel;
