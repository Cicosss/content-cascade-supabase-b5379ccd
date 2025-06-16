
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MACRO_AREAS, getCategoriesForMacroArea } from '@/config/categoryMapping';
import ProgressBar from './ProgressBar';
import Step1BasicInfo from './wizard/Step1BasicInfo';
import Step2LocationDetails from './wizard/Step2LocationDetails';
import Step3ScheduleMedia from './wizard/Step3ScheduleMedia';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  const steps = [
    'Info Principali',
    'Dettagli e Luogo', 
    'Orari e Media'
  ];
  
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
      
      if (formData.category && !categories.includes(formData.category)) {
        setFormData(prev => ({ ...prev, category: '' }));
      }
    }
  }, [formData.macro_area]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.submitter_email || !formData.name || !formData.macro_area || !formData.category || !formData.description) {
          toast({
            title: "Campi obbligatori mancanti",
            description: "Email, nome, macro-area, categoria e descrizione sono obbligatori",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        // Step 2 validation can be added here if needed
        break;
      case 3:
        // Step 3 validation can be added here if needed
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsLoading(true);

    try {
      const submissionData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        start_datetime: formData.start_datetime || null,
        end_datetime: formData.end_datetime || null,
      };

      const { data, error } = await supabase
        .from('poi_submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) throw error;

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

      setCurrentStep(1);
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            formData={formData}
            onInputChange={handleInputChange}
            availableCategories={availableCategories}
          />
        );
      case 2:
        return (
          <Step2LocationDetails
            formData={formData}
            onInputChange={handleInputChange}
            onTagChange={handleTagChange}
          />
        );
      case 3:
        return (
          <Step3ScheduleMedia
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      default:
        return null;
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
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={steps.length} 
          steps={steps} 
        />
        
        {renderCurrentStep()}

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Indietro
          </Button>

          {currentStep < steps.length ? (
            <Button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              Avanti
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                'Invia per Revisione'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default POISubmissionForm;
