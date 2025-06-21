
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { AVAILABLE_TAGS } from '@/config/categoryMapping';

interface TagsSelectorProps {
  tags: string[];
  onTagChange: (tag: string, checked: boolean) => void;
}

const TagsSelector: React.FC<TagsSelectorProps> = ({ tags, onTagChange }) => {
  return (
    <div>
      <Label>Tag (opzionali)</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
        {AVAILABLE_TAGS.map((tag) => (
          <div key={tag} className="flex items-center space-x-2">
            <Checkbox
              id={`tag-${tag}`}
              checked={tags?.includes(tag) || false}
              onCheckedChange={(checked) => onTagChange(tag, checked as boolean)}
            />
            <label 
              htmlFor={`tag-${tag}`} 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {tag}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsSelector;
