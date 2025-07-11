import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { POISubmission } from './POISubmission';
import { OFFICIAL_CATEGORIES } from '@/config/categoryMapping';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import RichTextEditor from '@/components/ui/rich-text-editor';

interface EditSubmissionModalProps {
  submission: POISubmission | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const EditSubmissionModal: React.FC<EditSubmissionModalProps> = ({
  submission,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<POISubmission>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (submission) {
      setFormData({ ...submission });
    }
  }, [submission]);

  const handleInputChange = (field: keyof POISubmission, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!submission || !formData) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('poi_submissions')
        .update({
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
          updated_at: new Date().toISOString()
        })
        .eq('id', submission.id);

      if (error) throw error;

      toast.success('Proposta aggiornata con successo');
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Errore nell\'aggiornamento della proposta');
    } finally {
      setIsSaving(false);
    }
  };

  if (!submission || !formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifica Proposta: {submission.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Descrivi l'esperienza, i servizi offerti, l'atmosfera..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? 'Salvataggio...' : 'Salva Modifiche'}
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Annulla
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditSubmissionModal;
