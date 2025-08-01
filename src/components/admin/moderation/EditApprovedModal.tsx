
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApprovedExperience } from '@/hooks/useApprovedExperiences';
import { OFFICIAL_CATEGORIES } from '@/config/categoryMapping';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import CompactMediaUploader from '@/components/admin/CompactMediaUploader';
import RichTextEditor from '@/components/ui/rich-text-editor';

interface EditApprovedModalProps {
  experience: ApprovedExperience | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedExperience: ApprovedExperience) => void;
}

const EditApprovedModal: React.FC<EditApprovedModalProps> = ({
  experience,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<ApprovedExperience>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (experience) {
      setFormData({ ...experience });
    }
  }, [experience]);

  const handleInputChange = (field: keyof ApprovedExperience, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
    console.log('🖼️ Images updated in modal:', images);
  };

  const handleSave = async () => {
    if (!experience || !formData) return;

    setIsSaving(true);
    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        address: formData.address,
        price_info: formData.price_info,
        duration_info: formData.duration_info,
        target_audience: formData.target_audience,
        phone: formData.phone,
        email: formData.email,
        website_url: formData.website_url,
        organizer_info: formData.organizer_info,
        opening_hours: formData.opening_hours,
        images: formData.images,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('points_of_interest')
        .update(updateData)
        .eq('id', experience.id);

      if (error) throw error;

      const updatedExperience = { ...experience, ...updateData };
      onSave(updatedExperience);
      toast.success('Esperienza aggiornata con successo');
      onClose();
    } catch (error) {
      console.error('Error updating experience:', error);
      toast.error('Errore nell\'aggiornamento dell\'esperienza');
    } finally {
      setIsSaving(false);
    }
  };

  if (!experience || !formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-hidden flex flex-col bg-white dark:bg-gray-800 border shadow-lg"
                     aria-describedby="edit-description"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">Modifica Esperienza Live: {experience.name}</DialogTitle>
        </DialogHeader>
        
        {/* Scrollable content area */}
        <div id="edit-description" className="flex-1 overflow-y-auto px-1">
          <div className="space-y-6 pb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                ⚡ Stai modificando un'esperienza <strong>già pubblicata</strong>. 
                Le modifiche saranno immediatamente visibili agli utenti.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">Categoria *</Label>
              <Select 
                value={formData.category || ''} 
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OFFICIAL_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>


          <div>
            <Label htmlFor="description">Descrizione</Label>
            <RichTextEditor
              value={formData.description || ''}
              onChange={(value) => handleInputChange('description', value)}
              placeholder="Descrivi l'esperienza in dettaglio..."
            />
          </div>

          <div>
            <Label htmlFor="address">Indirizzo</Label>
            <Input
              id="address"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>
            {/* Sezione Galleria Immagini - Compatta */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <CompactMediaUploader
                images={formData.images || []}
                onImagesChange={handleImagesChange}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_info">Prezzo</Label>
              <Input
                id="price_info"
                value={formData.price_info || ''}
                onChange={(e) => handleInputChange('price_info', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="duration_info">Durata</Label>
              <Input
                id="duration_info"
                value={formData.duration_info || ''}
                onChange={(e) => handleInputChange('duration_info', e.target.value)}
              />
            </div>
          </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="website_url">Sito Web</Label>
              <Input
                id="website_url"
                type="url"
                value={formData.website_url || ''}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
              />
            </div>
            </div>
          </div>
        </div>

        {/* Fixed footer with action buttons */}
        <div className="flex-shrink-0 border-t bg-gray-50 px-6 py-4 mt-4">
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? 'Salvataggio...' : 'Salva Modifiche Live'}
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="min-w-[100px]"
            >
              Annulla
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditApprovedModal;
