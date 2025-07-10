
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MACRO_AREAS, getCategoriesForMacroArea, AVAILABLE_TAGS } from '@/config/categoryMapping';
import { FormData, initialFormData } from './POIFormData';
import { useGoogleMaps } from './useGoogleMaps';
import { useFormValidation } from './useFormValidation';
import MediaUploader from '@/components/admin/MediaUploader';
import RichTextEditor from '@/components/ui/rich-text-editor';
import DynamicCsvUploader from '@/components/admin/DynamicCsvUploader';

const POIFormComponent: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>(['Ristoranti']);

  const { isGoogleMapsLoaded, addressInputRef } = useGoogleMaps(formData, setFormData, setIsAddressConfirmed);
  const { validateForm } = useFormValidation();

  // Aggiornamento categorie disponibili
  useEffect(() => {
    if (formData.macro_area) {
      const categories = getCategoriesForMacroArea(formData.macro_area);
      setAvailableCategories(categories);
      
      if (!categories.includes(formData.category)) {
        setFormData(prev => ({ ...prev, category: categories[0] || '' }));
      }
    }
  }, [formData.macro_area, formData.category]);

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, address: value }));
    
    if (isAddressConfirmed && value !== formData.address) {
      setIsAddressConfirmed(false);
      console.log('🔄 Reset conferma indirizzo per digitazione manuale');
    }
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tags: checked 
        ? [...prev.tags, tag]
        : prev.tags.filter(t => t !== tag)
    }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
    console.log('🖼️ Images updated:', images);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm(formData, isAddressConfirmed);
    if (errors.length > 0) {
      setValidationErrors(errors);
      toast.error('Controlla i campi obbligatori');
      return;
    }

    setIsSubmitting(true);
    setValidationErrors([]);

    try {
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
        images: formData.images,
        status: 'pending',
        submitter_email: 'admin@miaromagna.it'
      };

      console.log('📤 Submitting data with images:', submissionData.images);

      const { error } = await supabase
        .from('poi_submissions')
        .insert([submissionData]);

      if (error) {
        throw error;
      }

      toast.success('Proposta inviata con successo per la revisione!');
      resetForm();
      console.log('✅ Proposta POI inviata con successo con immagini');

    } catch (error) {
      console.error('❌ Errore invio proposta:', error);
      toast.error('Errore durante l\'invio della proposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsAddressConfirmed(false);
    setValidationErrors([]);
    toast.info('Form resettato');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aggiungi Nuova Esperienza</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">📝 Inserimento Manuale</TabsTrigger>
            <TabsTrigger value="csv">📊 Upload CSV</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manual" className="mt-6">
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
            <RichTextEditor
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              placeholder={
                formData.poi_type === 'event' 
                  ? 'Descrivi l\'evento, il programma, cosa aspettarsi...'
                  : 'Descrivi il luogo, i servizi offerti, l\'atmosfera...'
              }
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

          {/* Sezione Galleria Immagini */}
          <MediaUploader
            images={formData.images}
            onImagesChange={handleImagesChange}
          />

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
          </TabsContent>
          
          <TabsContent value="csv" className="mt-6">
            <DynamicCsvUploader onSuccess={() => toast.success('CSV importato con successo!')} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default POIFormComponent;
