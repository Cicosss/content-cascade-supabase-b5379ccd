
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ExperienceUploadFormProps {
  onExperienceAdded: () => void;
}

const ExperienceUploadForm: React.FC<ExperienceUploadFormProps> = ({ onExperienceAdded }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');
  const [loading, setLoading] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  // Form state for manual entry
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    latitude: '',
    longitude: '',
    price_info: '',
    duration_info: '',
    target_audience: 'everyone',
    website_url: '',
    phone: '',
    email: ''
  });

  const categories = [
    'Gastronomia',
    'Sport',
    'Cultura',
    'Natura',
    'Relax',
    'Famiglia',
    'Avventura',
    'Shopping'
  ];

  const targetAudiences = [
    { value: 'everyone', label: 'Tutti' },
    { value: 'families', label: 'Famiglie' },
    { value: 'couples', label: 'Coppie' },
    { value: 'young', label: 'Giovani' },
    { value: 'adults', label: 'Adulti' },
    { value: 'seniors', label: 'Senior' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const experienceData = {
        ...formData,
        poi_type: 'experience',
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        status: 'approved' // Inserimento diretto da admin
      };

      const { error } = await supabase
        .from('points_of_interest')
        .insert([experienceData]);

      if (error) {
        console.error('Error inserting experience:', error);
        toast.error('Errore nell\'inserimento dell\'esperienza');
        return;
      }

      toast.success('Esperienza inserita con successo!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        address: '',
        latitude: '',
        longitude: '',
        price_info: '',
        duration_info: '',
        target_audience: 'everyone',
        website_url: '',
        phone: '',
        email: ''
      });

      onExperienceAdded();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nell\'inserimento dell\'esperienza');
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast.error('Seleziona un file CSV');
      return;
    }

    setLoading(true);

    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error('Il file CSV deve contenere almeno una riga di header e una di dati');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const experiences = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length !== headers.length) {
          console.warn(`Riga ${i + 1} ignorata: numero di colonne non corrispondente`);
          continue;
        }

        const experience: any = {
          poi_type: 'experience',
          status: 'approved'
        };

        headers.forEach((header, index) => {
          const value = values[index];
          
          switch (header.toLowerCase()) {
            case 'name':
            case 'nome':
              experience.name = value;
              break;
            case 'description':
            case 'descrizione':
              experience.description = value;
              break;
            case 'category':
            case 'categoria':
              experience.category = value;
              break;
            case 'address':
            case 'indirizzo':
              experience.address = value;
              break;
            case 'latitude':
            case 'latitudine':
              experience.latitude = value ? parseFloat(value) : null;
              break;
            case 'longitude':
            case 'longitudine':
              experience.longitude = value ? parseFloat(value) : null;
              break;
            case 'price_info':
            case 'prezzo':
              experience.price_info = value;
              break;
            case 'duration_info':
            case 'durata':
              experience.duration_info = value;
              break;
            case 'target_audience':
            case 'pubblico':
              experience.target_audience = value || 'everyone';
              break;
            case 'website_url':
            case 'sito_web':
              experience.website_url = value;
              break;
            case 'phone':
            case 'telefono':
              experience.phone = value;
              break;
            case 'email':
              experience.email = value;
              break;
          }
        });

        if (experience.name && experience.category) {
          experiences.push(experience);
        }
      }

      if (experiences.length === 0) {
        toast.error('Nessuna esperienza valida trovata nel CSV');
        return;
      }

      const { error } = await supabase
        .from('points_of_interest')
        .insert(experiences);

      if (error) {
        console.error('Error inserting experiences:', error);
        toast.error('Errore nell\'inserimento delle esperienze');
        return;
      }

      toast.success(`${experiences.length} esperienze inserite con successo!`);
      setCsvFile(null);
      onExperienceAdded();
    } catch (error) {
      console.error('Error processing CSV:', error);
      toast.error('Errore nell\'elaborazione del file CSV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Aggiungi Nuove Esperienze
        </CardTitle>
        
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'manual' ? 'default' : 'outline'}
            onClick={() => setActiveTab('manual')}
            size="sm"
          >
            Inserimento Manuale
          </Button>
          <Button
            variant={activeTab === 'csv' ? 'default' : 'outline'}
            onClick={() => setActiveTab('csv')}
            size="sm"
          >
            Upload CSV
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {activeTab === 'manual' ? (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nome Esperienza *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="address">Indirizzo</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="latitude">Latitudine</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="longitude">Longitudine</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price_info">Informazioni Prezzo</Label>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="target_audience">Pubblico di Riferimento</Label>
                <Select value={formData.target_audience} onValueChange={(value) => handleInputChange('target_audience', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {targetAudiences.map((audience) => (
                      <SelectItem key={audience.value} value={audience.value}>
                        {audience.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Inserimento...' : 'Inserisci Esperienza'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file">File CSV</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Formato CSV Richiesto
              </h4>
              <p className="text-sm text-blue-700 mb-2">
                Il file CSV deve contenere le seguenti colonne (nell'ordine che preferisci):
              </p>
              <code className="text-xs bg-white p-2 rounded block overflow-x-auto">
                name,description,category,address,latitude,longitude,price_info,duration_info,target_audience,website_url,phone,email
              </code>
              <p className="text-xs text-blue-600 mt-2">
                * I campi obbligatori sono: name, category<br/>
                * Le coordinate latitude/longitude sono opzionali ma consigliate per la mappa
              </p>
            </div>

            <Button 
              onClick={handleCsvUpload} 
              disabled={!csvFile || loading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {loading ? 'Caricamento...' : 'Carica CSV'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceUploadForm;
