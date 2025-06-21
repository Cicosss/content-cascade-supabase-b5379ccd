
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ApprovedExperienceCard from './ApprovedExperienceCard';

interface ApprovedExperience {
  id: string;
  name: string;
  description: string;
  macro_area: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  price_info: string;
  duration_info: string;
  target_audience: string;
  images: string[];
  website_url: string;
  phone: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  organizer_info: string;
  status: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  poi_type: string;
  opening_hours: string;
}

interface ApprovedExperiencesListProps {
  experiences: ApprovedExperience[];
  totalCount: number;
  onEdit: (experience: ApprovedExperience) => void;
  onDelete: (experience: ApprovedExperience) => void;
}

const ApprovedExperiencesList: React.FC<ApprovedExperiencesListProps> = ({
  experiences,
  totalCount,
  onEdit,
  onDelete
}) => {
  if (experiences.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            {totalCount === 0 
              ? 'Nessuna esperienza trovata nel database' 
              : 'Nessuna esperienza corrisponde ai filtri selezionati'
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {experiences.map((experience) => (
        <ApprovedExperienceCard
          key={experience.id}
          experience={experience}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ApprovedExperiencesList;
