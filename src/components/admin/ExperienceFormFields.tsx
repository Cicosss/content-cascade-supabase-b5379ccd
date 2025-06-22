
import React from 'react';
import POITypeSelector from './form-fields/POITypeSelector';
import BasicInfoFields from './form-fields/BasicInfoFields';
import DateTimeFields from './form-fields/DateTimeFields';
import LocationFields from './form-fields/LocationFields';
import ContactInfoFields from './form-fields/ContactInfoFields';
import TagsSelector from './form-fields/TagsSelector';

interface ExperienceFormFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string | string[]) => void;
  onBatchUpdate?: (updates: Record<string, string>) => void;
  isAddressConfirmed?: boolean;
  onAddressConfirmationChange?: (isConfirmed: boolean) => void;
}

const ExperienceFormFields: React.FC<ExperienceFormFieldsProps> = ({ 
  formData, 
  onInputChange, 
  onBatchUpdate,
  isAddressConfirmed,
  onAddressConfirmationChange
}) => {
  const handleTagChange = (tag: string, checked: boolean) => {
    const currentTags = formData.tags || [];
    const newTags = checked 
      ? [...currentTags, tag]
      : currentTags.filter((t: string) => t !== tag);
    
    onInputChange('tags', newTags);
  };

  const isEvent = formData.poi_type === 'event';

  return (
    <>
      <POITypeSelector
        value={formData.poi_type}
        onChange={(value) => onInputChange('poi_type', value)}
      />

      <BasicInfoFields
        formData={formData}
        onInputChange={onInputChange}
      />

      {/* Campi condizionali per eventi */}
      {isEvent && (
        <DateTimeFields
          formData={formData}
          onInputChange={onInputChange}
        />
      )}

      <LocationFields
        formData={formData}
        onInputChange={onInputChange}
        onBatchUpdate={onBatchUpdate}
        isAddressConfirmed={isAddressConfirmed}
        onAddressConfirmationChange={onAddressConfirmationChange}
      />

      <ContactInfoFields
        formData={formData}
        onInputChange={onInputChange}
      />

      <TagsSelector
        tags={formData.tags || []}
        onTagChange={handleTagChange}
      />
    </>
  );
};

export default ExperienceFormFields;
