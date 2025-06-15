
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';
import { Loader2, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MACRO_AREAS, getCategoriesForMacroArea, AVAILABLE_TAGS } from '@/config/categoryMapping';

interface POISubmissionFormProps {
  onSubmissionSuccess: () => void;
}

interface FormData {
  submitter_email: string;
  name: string;
  description: string;
  macro_area: string;
  category: string;
  tags: string[];
  address: string;
  latitude: string;
  longitude: string;
  price_info: string;
  duration_info: string;
  target_audience: string;
  website_url: string;
  phone: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  organizer_info: string;
  video_url: string;
}

const POISubmissionForm: React.FC<POISubmissionFormProps> = ({ onSubmissionSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    submitter_email: '',
    name: '',
    description: '',
    macro_area: '',
    category: '',
    tags: [],
    address: '',
    latitude: '',
    longitude: '',
    price_info: '',
    duration_info: '',
    target_audience: 'everyone',
    website_url: '',
    phone: '',
    email: '',
    start_datetime: '',
    end_datetime: '',
    location_name: '',
    organizer_info: '',
    video_url: ''
  });

  useEffect(() => {
    if (formData.macro_area) {
      const categories = getCategoriesForMacroArea(formData.macro_area);
      setAvailableCategories(categories);
      
      // Reset category if it's not valid for the new macro area
      if (formData.category && !categories.includes(formData.category)) {
        setFormData(prev => ({ ...prev, category: '' }));
      }
    }
  }, [formData.macro_area]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validazione base
      if (!formData.submitter_email || !formData.name || !formData.macro_area || !formData.category) {
        toast({
          title: "Campi obbligatori mancanti",
          description: "Email, nome, macro-area e categoria sono obbligatori",
          variant: "destructive",
        });
        return;
      }

      // Prepara i dati per l'inserimento
      const submissionData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        start_datetime: formData.start_datetime || null,
        end_datetime: formData.end_datetime || null,
      };

      // Inserisci nel database
      const { data, error } = await supabase
        .from('poi_submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) throw error;

      // Invia email di notifica tramite edge function
      await supabase.functions.invoke('send-poi-notification', {
        body: {
          submission: data,
          type: 'new_submission'
        }
      });

      toast({
        title: "POI inviata per revisione",
        description: "La tua proposta è stata inviata e sarà revisionata dal team. Riceverai una email di conferma.",
      });

      // Reset form
      setFormData({
        submitter_email: '',
        name: '',
        description: '',
        macro_area: '',
        category: '',
        tags: [],
        address: '',
        latitude: '',
        longitude: '',
        price_info: '',
        duration_info: '',
        target_audience: 'everyone',
        website_url: '',
        phone: '',
        email: '',
        start_datetime: '',
        end_datetime: '',
        location_name: '',
        organizer_info: '',
        video_url: ''
      });

      onSubmissionSuccess();

    } catch (error) {
      console.error('Errore nell\'invio:', error);
      toast({
        title: "Errore nell'invio",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Nuova Proposta POI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Informazioni di contatto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="submitter_email">Email del Promotore *</Label>
              <Input
                id="submitter_email"
                type="email"
                value={formData.submitter_email}
                onChange={(e) => setFormData({...formData, submitter_email: e.target.value})}
                placeholder="La tua email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Numero di telefono"
              />
            </div>
          </div>

          {/* Informazioni base */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome POI/Evento *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nome dell'attrazione o evento"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descrizione dettagliata"
                rows={4}
              />
            </div>
          </div>

          {/* Macro-Area e Categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="macro_area">Macro-Area *</Label>
              <Select 
                value={formData.macro_area} 
                onValueChange={(value) => setFormData({...formData, macro_area: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona la macro-area" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(MACRO_AREAS).map((macroArea) => (
                    <SelectItem key={macroArea} value={macroArea}>
                      {macroArea}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
                disabled={!formData.macro_area}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona prima una macro-area" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    checked={formData.tags?.includes(tag) || false}
                    onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
                  />
                  <label htmlFor={`tag-${tag}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Posizione */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Indirizzo</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Via, Città, Provincia"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location_name">Nome Località</Label>
                <Input
                  id="location_name"
                  value={formData.location_name}
                  onChange={(e) => setFormData({...formData, location_name: e.target.value})}
                  placeholder="Es. Centro Storico"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitudine</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                  placeholder="44.0646"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitudine</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                  placeholder="12.5736"
                />
              </div>
            </div>
          </div>

          {/* Date e Orari (per eventi) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_datetime">Data/Ora Inizio</Label>
              <Input
                id="start_datetime"
                type="datetime-local"
                value={formData.start_datetime}
                onChange={(e) => setFormData({...formData, start_datetime: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_datetime">Data/Ora Fine</Label>
              <Input
                id="end_datetime"
                type="datetime-local"
                value={formData.end_datetime}
                onChange={(e) => setFormData({...formData, end_datetime: e.target.value})}
              />
            </div>
          </div>

          {/* Informazioni aggiuntive */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price_info">Informazioni Prezzo</Label>
              <Input
                id="price_info"
                value={formData.price_info}
                onChange={(e) => setFormData({...formData, price_info: e.target.value})}
                placeholder="Es. €15, Gratuito"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration_info">Durata</Label>
              <Input
                id="duration_info"
                value={formData.duration_info}
                onChange={(e) => setFormData({...formData, duration_info: e.target.value})}
                placeholder="Es. 2 ore, Tutto il giorno"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_audience">Target Audience</Label>
              <Select 
                value={formData.target_audience} 
                onValueChange={(value) => setFormData({...formData, target_audience: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everyone">Tutti</SelectItem>
                  <SelectItem value="families">Famiglie</SelectItem>
                  <SelectItem value="adults">Solo Adulti</SelectItem>
                  <SelectItem value="children">Bambini</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contatti e Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website_url">Sito Web</Label>
              <Input
                id="website_url"
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email di Contatto</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="info@esempio.it"
              />
            </div>
          </div>

          {/* Video e Note */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL (opzionale)</Label>
              <Input
                id="video_url"
                type="url"
                value={formData.video_url}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                placeholder="Link YouTube, Vimeo, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organizer_info">Informazioni Organizzatore</Label>
              <Textarea
                id="organizer_info"
                value={formData.organizer_info}
                onChange={(e) => setFormData({...formData, organizer_info: e.target.value})}
                placeholder="Chi organizza questo evento/gestisce questo POI"
                rows={3}
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Invio in corso...
              </>
            ) : (
              'Invia per Revisione'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default POISubmissionForm;
