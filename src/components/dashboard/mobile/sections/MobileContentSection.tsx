import React, { memo } from 'react';
import PersonalizedContent from '@/components/dashboard/PersonalizedContent';
import { APIErrorBoundary } from '@/components/dashboard/APIErrorBoundary';

/**
 * Presentational Component - Mobile Content Section
 * 
 * Responsabilità:
 * - Rendering contenuti personalizzati per mobile
 * - Layout ottimizzato per scroll verticale
 * - Error boundary per contenuti dinamici
 */

const MobileContentSection: React.FC = memo(() => {
  return (
    <div className="space-y-6">
      <APIErrorBoundary>
        <PersonalizedContent />
      </APIErrorBoundary>
    </div>
  );
});

MobileContentSection.displayName = 'MobileContentSection';

export default MobileContentSection;