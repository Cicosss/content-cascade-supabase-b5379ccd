
import React from 'react';
import { Phone, Mail, Globe } from 'lucide-react';
import { ensureSafeExternalUrl } from '@/utils/url';

interface POIContactInfoProps {
  phone?: string;
  email?: string;
  websiteUrl?: string;
}

const POIContactInfo: React.FC<POIContactInfoProps> = ({
  phone,
  email,
  websiteUrl
}) => {
  if (!phone && !email && !websiteUrl) {
    return null;
  }

  return (
    <div className="border-t pt-4 space-y-3">
      {phone && (
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <a href={`tel:${phone}`} className="text-blue-600 hover:text-blue-700 hover:underline text-sm">
            {phone}
          </a>
        </div>
      )}

      {email && (
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-700 hover:underline text-sm">
            {email}
          </a>
        </div>
      )}

      {websiteUrl && (
        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <a 
            href={ensureSafeExternalUrl(websiteUrl)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 hover:underline text-sm"
          >
            Sito web
          </a>
        </div>
      )}
    </div>
  );
};

export default POIContactInfo;
