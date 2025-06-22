import React, { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MACRO_AREAS, getCategoriesForMacroArea, AVAILABLE_TAGS } from '@/config/categoryMapping';

// New imports for moderation components
import PendingSubmissionsTable from './moderation/PendingSubmissionsTable';
import ApprovedExperiencesTable from './moderation/ApprovedExperiencesTable';
import RejectSubmissionModal from './moderation/RejectSubmissionModal';
import EditSubmissionModal from './moderation/EditSubmissionModal';
import EditApprovedModal from './moderation/EditApprovedModal';
import DeleteConfirmModal from './moderation/DeleteConfirmModal';
import { usePOISubmissions } from './moderation/usePOISubmissions';
import { useApprovedExperiences } from '@/hooks/useApprovedExperiences';
import { useModerationActions } from './moderation/useModerationActions';
import { POISubmission } from './moderation/POISubmission';

// Definizione interfaccia per i dati del form
interface FormData {
  poi_type: 'place' | 'event';
  name: string;
  macro_area: string;
  category: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  location_name: string;
  organizer_info: string;
  price_info: string;
  duration_info: string;
  target_audience: string;
  phone: string;
  email: string;
  website_url: string;
  opening_hours: string;
  start_datetime: string;
  end_datetime: string;
  tags: string[];
}

// Stato iniziale del form
const initialFormData: FormData = {
  poi_type: 'place',
  name: '',
  macro_area: 'Gusto & Sapori',
  category: 'Ristoranti',
  description: '',
  address: '',
  latitude: '',
  longitude: '',
  location_name: '',
  organizer_info: '',
  price_info: '',
  duration_info: '',
  target_audience: 'everyone',
  phone: '',
  email: '',
  website_url: '',
  opening_hours: '',
  start_datetime: '',
  end_datetime: '',
  tags: []
};

const AdminPanel: React.FC = () => {
  // Stati del componente
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>(['Ristoranti']);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState(false);
  
  // Ref per il campo indirizzo
  const addressInputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Caricamento Google Maps
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsGoogleMapsLoaded(true);
        return;
      }

      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBYu9y2Rig3ueioFfy-Ait65lRcOTIIR6A&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setIsGoogleMapsLoaded(true);
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Inizializzazione Google Places Autocomplete
  useEffect(() => {
    if (!isGoogleMapsLoaded || !addressInputRef.current || autocompleteRef.current) {
      return;
    }

    try {
      const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'IT' },
        fields: ['formatted_address', 'geometry', 'address_components']
      });

      autocompleteRef.current = autocomplete;
      
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (!place.geometry?.location) {
          console.log('❌ Nessuna geometria nel luogo selezionato');
          return;
        }

        // Estrazione componenti indirizzo
        let city = '';
        if (place.address_components) {
          place.address_components.forEach(component => {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }
          });
        }

        // Aggiornamento stato del form
        setFormData(prev => ({
          ...prev,
          address: place.formatted_address || '',
          latitude: place.geometry!.location!.lat().toString(),
          longitude: place.geometry!.location!.lng().toString(),
          location_name: prev.location_name || city
        }));

        // Conferma indirizzo selezionato
        setIsAddressConfirmed(true);
        console.log('✅ Indirizzo confermato da Google Places');
      });

    } catch (error) {
      console.error('❌ Errore inizializzazione autocomplete:', error);
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isGoogleMapsLoaded]);

  // Aggiornamento categorie disponibili
  useEffect(() => {
    if (formData.macro_area) {
      const categories = getCategoriesForMacroArea(formData.macro_area);
      setAvailableCategories(categories);
      
      // Reset categoria se non più valida
      if (!categories.includes(formData.category)) {
        setFormData(prev => ({ ...prev, category: categories[0] || '' }));
      }
    }
  }, [formData.macro_area, formData.category]);

  // New state for moderation functionality
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [editSubmissionModalOpen, setEditSubmissionModalOpen] = useState(false);
  const [editApprovedModalOpen, setEditApprovedModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<POISubmission | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<any>(null);

  // Hooks for moderation data and actions
  const { submissions, loading: submissionsLoading, fetchSubmissions, updateSubmissionStatus, deleteSubmission } = usePOISubmissions();
  const { experiences, filteredExperiences, loading: experiencesLoading, deleteExperience, deApproveExperience, updateExperience } = useApprovedExperiences();
  const { updating, updateSubmissionStatus: moderateSubmission } = useModerationActions();

  // Apply empty filters to show all experiences initially
  useEffect(() => {
    const emptyFilters = {
      status: 'tutti',
      category: 'tutti',
      macroArea: 'tutti',
      searchTerm: '',
      poiType: 'tutti'
    };
    // Apply filters to show all experiences
    if (experiences.length > 0) {
      // This will be called by the hook internally
    }
  }, [experiences]);

  // Moderation action handlers
  const handleApproveSubmission = async (submission: POISubmission) => {
    await moderateSubmission(submission.id, 'approved', 'Approvato dall\'amministratore', submission, updateSubmissionStatus);
    fetchSubmissions();
  };

  const handleRejectSubmission = (submission: POISubmission) => {
    setSelectedSubmission(submission);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (submissionId: string, reason: string) => {
    await moderateSubmission(submissionId, 'rejected', reason, null, updateSubmissionStatus);
    fetchSubmissions();
  };

  const handleEditSubmission = (submission: POISubmission) => {
    setSelectedSubmission(submission);
    setEditSubmissionModalOpen(true);
  };

  const handlePreviewSubmission = (submission: POISubmission) => {
    // Open POI detail page in new tab with preview mode
    const previewUrl = `/esperienze/${submission.id}?preview=true`;
    window.open(previewUrl, '_blank');
  };

  const handleRevertExperience = async (experience: any) => {
    await deApproveExperience(experience);
  };

  const handleEditApproved = (experience: any) => {
    setSelectedExperience(experience);
    setEditApprovedModalOpen(true);
  };

  const handleDeleteExperience = (experience: any) => {
    setSelectedExperience(experience);
    setDeleteConfirmModalOpen(true);
  };

  const handleConfirmDelete = async (experienceId: string) => {
    await deleteExperience(experienceId);
  };

  // Gestione cambio input generico
  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset errori di validazione
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  // Gestione cambio indirizzo manuale
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, address: value }));
    
    // Reset conferma se l'utente digita manualmente
    if (isAddressConfirmed && value !== formData.address) {
      setIsAddressConfirmed(false);
      console.log('🔄 Reset conferma indirizzo per digitazione manuale');
    }
  };

  // Gestione tag
  const handleTagChange = (tag: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tags: checked 
        ? [...prev.tags, tag]
        : prev.tags.filter(t => t !== tag)
    }));
  };

  // Validazione del form
  const validateForm = (): string[] => {
    const errors: string[] = [];

    // Campi obbligatori
    if (!formData.name.trim()) errors.push('Il nome è obbligatorio');
    if (!formData.macro_area) errors.push('La macro-area è obbligatoria');
    if (!formData.category) errors.push('La categoria è obbligatoria');
    if (!formData.address.trim()) errors.push('L\'indirizzo è obbligatorio');
    
    // Controllo conferma indirizzo
    if (!isAddressConfirmed) {
      errors.push('Seleziona un indirizzo valido dalla lista di Google Places');
    }

    // Validazione coordinate
    if (!formData.latitude || !formData.longitude) {
      errors.push('Coordinate mancanti - seleziona un indirizzo dalla lista');
    }

    // Validazione eventi
    if (formData.poi_type === 'event' && !formData.start_datetime) {
      errors.push('La data di inizio è obbligatoria per gli eventi');
    }

    return errors;
  };

  // Invio del form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error('Controlla i campi obbligatori');
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      // Preparazione dati per l'invio
      const submissionData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        poi_type: formData.poi_type,
        macro_area: formData.macro_area,
        category: formData.category,
        address: formData.address.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        location_name: formData.location_name.trim() || null,
        organizer_info: formData.organizer_info.trim() || null,
        price_info: formData.price_info.trim() || null,
        duration_info: formData.duration_info.trim() || null,
        target_audience: formData.target_audience,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        website_url: formData.website_url.trim() || null,
        opening_hours: formData.opening_hours.trim() || null,
        start_datetime: formData.start_datetime || null,
        end_datetime: formData.end_datetime || null,
        tags: formData.tags,
        status: 'pending',
        submitter_email: 'admin@miaromagna.it'
      };

      // Invio diretto al database
      const { error } = await supabase
        .from('poi_submissions')
        .insert([submissionData]);

      if (error) {
        throw error;
      }

      // Successo
      toast.success('Proposta inviata con successo per la revisione!');
      
      // Reset completo del form
      setFormData(initialFormData);
      setIsAddressConfirmed(false);
      setValidationErrors([]);
      
      console.log('✅ Proposta POI inviata con successo');

    } catch (error) {
      console.error('❌ Errore invio proposta:', error);
      toast.error('Errore durante l\'invio della proposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormData);
    setIsAddressConfirmed(false);
    setValidationErrors([]);
    toast.info('Form resettato');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🏛️ Panel di Moderazione POI</h1>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Proposte da Moderare</TabsTrigger>
          <TabsTrigger value="approved">Esperienze Approvate</TabsTrigger>
          <TabsTrigger value="add-new">Aggiungi Nuova</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-6">
          <PendingSubmissionsTable
            submissions={submissions}
            loading={submissionsLoading}
            onApprove={handleApproveSubmission}
            onReject={handleRejectSubmission}
            onEdit={handleEditSubmission}
            onPreview={handlePreviewSubmission}
            updating={updating}
          />
        </TabsContent>
        
        <TabsContent value="approved" className="mt-6">
          <ApprovedExperiencesTable
            experiences={experiences}
            loading={experiencesLoading}
            onRevert={handleRevertExperience}
            onEdit={handleEditApproved}
            onDelete={handleDeleteExperience}
            updating={updating}
          />
        </TabsContent>
        
        <TabsContent value="add-new" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Aggiungi Nuova Esperienza</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Errori di validazione */}
                {validationErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-red-800">Errori di validazione:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-red-700">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Selettore Tipo POI */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Cosa stai aggiungendo? *</Label>
                  <RadioGroup
                    value={formData.poi_type}
                    onValueChange={(value: 'place' | 'event') => handleInputChange('poi_type', value)}
                    className="flex flex-row gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="place" id="place" />
                      <Label htmlFor="place">📍 Luogo Permanente</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="event" id="event" />
                      <Label htmlFor="event">🗓️ Evento Temporaneo</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Informazioni Base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      {formData.poi_type === 'event' ? 'Nome dell\'Evento *' : 'Nome del Luogo *'}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={validationErrors.some(e => e.includes('nome')) ? 'border-red-500' : ''}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="macro_area">Macro-Area *</Label>
                    <Select 
                      value={formData.macro_area} 
                      onValueChange={(value) => handleInputChange('macro_area', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(MACRO_AREAS).map((area) => (
                          <SelectItem key={area} value={area}>{area}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Campo Indirizzo con Google Places */}
                <div className="space-y-2">
                  <Label htmlFor="address">Indirizzo *</Label>
                  <div className="relative">
                    <Input
                      id="address"
                      ref={addressInputRef}
                      type="text"
                      placeholder="Inizia a digitare l'indirizzo..."
                      value={formData.address}
                      onChange={handleAddressChange}
                      className={`pr-10 ${
                        isAddressConfirmed 
                          ? 'border-green-300 bg-green-50' 
                          : validationErrors.some(e => e.includes('indirizzo')) 
                            ? 'border-red-500' 
                            : ''
                      }`}
                      disabled={!isGoogleMapsLoaded}
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {!isGoogleMapsLoaded ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      ) : isAddressConfirmed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <MapPin className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Feedback visivo indirizzo */}
                  {formData.address && isAddressConfirmed && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
                      <CheckCircle className="h-4 w-4" />
                      <span>Indirizzo confermato e geolocalizzato</span>
                    </div>
                  )}
                  
                  {formData.address && !isAddressConfirmed && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      <span>Seleziona un indirizzo dalla lista per completare la geolocalizzazione</span>
                    </div>
                  )}
                </div>

                {/* Campi Aggiuntivi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location_name">Nome Località</Label>
                    <Input
                      id="location_name"
                      value={formData.location_name}
                      onChange={(e) => handleInputChange('location_name', e.target.value)}
                      placeholder="es. Centro Storico, Marina"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="organizer_info">
                      {formData.poi_type === 'event' ? 'Organizzatore' : 'Gestore/Proprietario'}
                    </Label>
                    <Input
                      id="organizer_info"
                      value={formData.organizer_info}
                      onChange={(e) => handleInputChange('organizer_info', e.target.value)}
                    />
                  </div>
                </div>

                {/* Campi Condizionali */}
                {formData.poi_type === 'place' && (
                  <div>
                    <Label htmlFor="opening_hours">Orari di Apertura</Label>
                    <Textarea
                      id="opening_hours"
                      value={formData.opening_hours}
                      onChange={(e) => handleInputChange('opening_hours', e.target.value)}
                      placeholder="es. Lun-Ven: 9:00-18:00, Sab: 9:00-13:00, Dom: Chiuso"
                      rows={2}
                    />
                  </div>
                )}

                {formData.poi_type === 'event' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_datetime">Data e Ora Inizio *</Label>
                      <Input
                        id="start_datetime"
                        type="datetime-local"
                        value={formData.start_datetime}
                        onChange={(e) => handleInputChange('start_datetime', e.target.value)}
                        className={validationErrors.some(e => e.includes('inizio')) ? 'border-red-500' : ''}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="end_datetime">Data e Ora Fine</Label>
                      <Input
                        id="end_datetime"
                        type="datetime-local"
                        value={formData.end_datetime}
                        onChange={(e) => handleInputChange('end_datetime', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {/* Informazioni Aggiuntive */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price_info">Prezzo</Label>
                    <Input
                      id="price_info"
                      value={formData.price_info}
                      onChange={(e) => handleInputChange('price_info', e.target.value)}
                      placeholder="es. €25 a persona"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="duration_info">Durata</Label>
                    <Input
                      id="duration_info"
                      value={formData.duration_info}
                      onChange={(e) => handleInputChange('duration_info', e.target.value)}
                      placeholder="es. 2 ore"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="target_audience">Pubblico</Label>
                    <Select 
                      value={formData.target_audience} 
                      onValueChange={(value) => handleInputChange('target_audience', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Tutti</SelectItem>
                        <SelectItem value="families">Famiglie</SelectItem>
                        <SelectItem value="couples">Coppie</SelectItem>
                        <SelectItem value="young">Giovani</SelectItem>
                        <SelectItem value="adults">Adulti</SelectItem>
                        <SelectItem value="seniors">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Contatti */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website_url">Sito Web</Label>
                    <Input
                      id="website_url"
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => handleInputChange('website_url', e.target.value)}
                    />
                  </div>
                </div>

                {/* Tag */}
                <div className="space-y-3">
                  <Label>Tag (opzionali)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {AVAILABLE_TAGS.map((tag) => (
                      <div key={tag} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag}`}
                          checked={formData.tags.includes(tag)}
                          onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
                        />
                        <Label htmlFor={`tag-${tag}`} className="text-sm">
                          {tag}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Debug Info */}
                {(formData.latitude || formData.longitude) && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    Debug: lat={formData.latitude}, lng={formData.longitude}, confirmed={isAddressConfirmed ? 'yes' : 'no'}
                  </div>
                )}

                {/* Pulsanti */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Invio in corso...
                      </>
                    ) : (
                      'Inserisci Esperienza'
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={isSubmitting}
                  >
                    Reset Form
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Moderation Modals */}
      <RejectSubmissionModal
        submission={selectedSubmission}
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setSelectedSubmission(null);
        }}
        onConfirm={handleConfirmReject}
      />

      <EditSubmissionModal
        submission={selectedSubmission}
        isOpen={editSubmissionModalOpen}
        onClose={() => {
          setEditSubmissionModalOpen(false);
          setSelectedSubmission(null);
        }}
        onSave={fetchSubmissions}
      />

      <EditApprovedModal
        experience={selectedExperience}
        isOpen={editApprovedModalOpen}
        onClose={() => {
          setEditApprovedModalOpen(false);
          setSelectedExperience(null);
        }}
        onSave={updateExperience}
      />

      <DeleteConfirmModal
        experience={selectedExperience}
        isOpen={deleteConfirmModalOpen}
        onClose={() => {
          setDeleteConfirmModalOpen(false);
          setSelectedExperience(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default AdminPanel;
