import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { OFFICIAL_CATEGORIES, AVAILABLE_TAGS } from '@/config/categoryMapping';
import { FormData, initialFormData } from './POIFormData';
import { useGoogleMaps } from './useGoogleMaps';
import { useFormValidation } from './useFormValidation';
import MediaUploader from '@/components/admin/MediaUploader';
import RichTextEditor from '@/components/ui/rich-text-editor';
import DynamicCsvUploader from '@/components/admin/DynamicCsvUploader';

interface POIFormComponentProps {
  onRefreshSubmissions: () => void;
}

const POIFormComponent: React.FC<POIFormComponentProps> = ({ onRefreshSubmissions }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [availableCategories, setAvailableCategories] = useState<string[]>([...OFFICIAL_CATEGORIES]);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { isGoogleMapsLoaded, addressInputRef } = useGoogleMaps(formData, setFormData, setIsAddressConfirmed);
  const { validateForm } = useFormValidation();

  // Ora usiamo direttamente tutte le 17 categorie ufficiali
  useEffect(() => {
    setAvailableCategories([...OFFICIAL_CATEGORIES]);
  }, []);

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Pulisci l'errore quando l'utente modifica il campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange('address', e.target.value);
    setIsAddressConfirmed(false);
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    const currentTags = formData.tags || [];
    let newTags;
    
    if (checked) {
      newTags = [...currentTags, tag];
    } else {
      newTags = currentTags.filter((t: string) => t !== tag);
    }
    
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione di base
    const validationErrors = validateForm(formData, isAddressConfirmed);
    if (validationErrors.length > 0) {
      toast.error(validationErrors[0]);
      return;
    }

    if (!isAddressConfirmed) {
      toast.error('Conferma l\'indirizzo selezionandolo dai suggerimenti di Google Maps');
      return;
    }

    setIsSubmitting(true);

    try {
      // Assicurati che latitude e longitude abbiano valori di default se non specificati
      const latitude = formData.latitude ? parseFloat(formData.latitude) : 44.0;
      const longitude = formData.longitude ? parseFloat(formData.longitude) : 12.0;

      // Preparazione dati per la submission
      const submissionData = {
        poi_type: formData.poi_type,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        address: formData.address,
        latitude: latitude,
        longitude: longitude,
        price_info: formData.price_info,
        duration_info: formData.duration_info,
        target_audience: formData.target_audience,
        website_url: formData.website_url,
        phone: formData.phone,
        email: formData.email,
        location_name: formData.location_name,
        organizer_info: formData.organizer_info,
        images: formData.images,
        start_datetime: formData.poi_type === 'event' ? (formData.start_datetime || null) : null,
        end_datetime: formData.poi_type === 'event' ? (formData.end_datetime || null) : null,
        opening_hours: formData.poi_type === 'place' ? formData.opening_hours : null,
        submitter_email: 'admin@miaromagna.it' // Admin submission
      };

      console.log('🔄 Submission data:', submissionData);

      const { data, error } = await supabase
        .from('poi_submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) {
        console.error('❌ Errore submission:', error);
        throw error;
      }

      console.log('✅ Submission inserita:', data);

      // Notifica email
      await supabase.functions.invoke('send-poi-notification', {
        body: {
          submission: data,
          type: 'new_submission'
        }
      });

      const successMessage = formData.poi_type === 'event' 
        ? "Evento inserito con successo" 
        : "Luogo inserito con successo";
      
      const successDescription = formData.poi_type === 'event'
        ? "L'evento è stato aggiunto e sarà visibile dopo la moderazione."
        : "Il luogo è stato aggiunto e sarà visibile dopo la moderazione.";

      toast.success(successMessage);
      resetForm();
      onRefreshSubmissions();

    } catch (error) {
      console.error('Errore nell\'invio:', error);
      toast.error('Si è verificato un errore. Riprova più tardi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsAddressConfirmed(false);
    setErrors({});
  };

  const isEvent = formData.poi_type === 'event';
  const isPlace = formData.poi_type === 'place';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Gestione POI - Nuovo Inserimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Inserimento Manuale</TabsTrigger>
            <TabsTrigger value="csv">Import CSV</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo di POI */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold">Tipo di POI *</Label>
                <RadioGroup
                  value={formData.poi_type}
                  onValueChange={(value) => handleInputChange('poi_type', value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="place" id="place" />
                    <Label htmlFor="place">Luogo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="event" id="event" />
                    <Label htmlFor="event">Evento</Label>
                  </div>
                </RadioGroup>
                {errors.poi_type && <p className="text-sm text-red-500">{errors.poi_type}</p>}
              </div>

              {/* Informazioni di base */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={isEvent ? "Nome dell'evento" : "Nome del luogo"}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                </div>
              </div>

              {/* Descrizione */}
              <div>
                <Label htmlFor="description">Descrizione</Label>
                <RichTextEditor
                  value={formData.description}
                  onChange={(value) => handleInputChange('description', value)}
                  placeholder={isEvent ? "Descrivi l'evento, i dettagli e cosa aspettarsi..." : "Descrivi il luogo, i servizi offerti e le caratteristiche..."}
                />
                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
              </div>

              {/* Indirizzo e posizione */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Indirizzo *</Label>
                  <div className="relative">
                    <Input
                      id="address"
                      ref={addressInputRef}
                      value={formData.address}
                      onChange={handleAddressChange}
                      placeholder="Inserisci l'indirizzo completo"
                    />
                    {isAddressConfirmed ? (
                      <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="absolute right-3 top-3 h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  {!isAddressConfirmed && formData.address && (
                    <p className="text-sm text-amber-600 mt-1">
                      Seleziona l'indirizzo dai suggerimenti per confermare la posizione
                    </p>
                  )}
                  {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">Latitudine</Label>
                    <Input
                      id="latitude"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange('latitude', e.target.value)}
                      placeholder="44.0000"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitudine</Label>
                    <Input
                      id="longitude"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange('longitude', e.target.value)}
                      placeholder="12.0000"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Informazioni aggiuntive */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="price_info">Informazioni Prezzo</Label>
                  <Input
                    id="price_info"
                    value={formData.price_info}
                    onChange={(e) => handleInputChange('price_info', e.target.value)}
                    placeholder="Es: €15-25, Gratuito, A offerta libera"
                  />
                </div>

                <div>
                  <Label htmlFor="duration_info">Durata</Label>
                  <Input
                    id="duration_info"
                    value={formData.duration_info}
                    onChange={(e) => handleInputChange('duration_info', e.target.value)}
                    placeholder={isEvent ? "Es: 2 ore, Tutto il giorno" : "Es: 1-2 ore di visita"}
                  />
                </div>
              </div>

              {/* Orari per luoghi */}
              {isPlace && (
                <div>
                  <Label htmlFor="opening_hours">Orari di Apertura</Label>
                  <Textarea
                    id="opening_hours"
                    value={formData.opening_hours}
                    onChange={(e) => handleInputChange('opening_hours', e.target.value)}
                    placeholder="Es: Lun-Ven 9:00-18:00, Sab 9:00-12:00, Dom chiuso"
                    rows={3}
                  />
                </div>
              )}

              {/* Date per eventi */}
              {isEvent && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="start_datetime">Data e Ora Inizio *</Label>
                    <Input
                      id="start_datetime"
                      type="datetime-local"
                      value={formData.start_datetime}
                      onChange={(e) => handleInputChange('start_datetime', e.target.value)}
                    />
                    {errors.start_datetime && <p className="text-sm text-red-500">{errors.start_datetime}</p>}
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

              {/* Contatti */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+39 XXX XXX XXXX"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contatti@esempio.it"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website_url">Sito Web</Label>
                <Input
                  id="website_url"
                  value={formData.website_url}
                  onChange={(e) => handleInputChange('website_url', e.target.value)}
                  placeholder="https://www.esempio.it"
                />
              </div>

              {/* Tag */}
              <div>
                <Label className="text-lg font-semibold">Tag</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {AVAILABLE_TAGS.map((tag) => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={formData.tags.includes(tag)}
                        onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
                      />
                      <Label htmlFor={`tag-${tag}`} className="text-sm">{tag}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Media Upload */}
              <div>
                <Label className="text-lg font-semibold">Immagini</Label>
                <MediaUploader
                  images={formData.images}
                  onImagesChange={handleImagesChange}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !isGoogleMapsLoaded}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Invio in corso...
                  </>
                ) : (
                  `Inserisci ${isEvent ? 'Evento' : 'Luogo'}`
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="csv">
            <DynamicCsvUploader onSuccess={() => onRefreshSubmissions()} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default POIFormComponent;