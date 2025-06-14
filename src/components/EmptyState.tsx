
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ""
}) => {
  return (
    <Card className={`p-12 text-center bg-gradient-to-br from-slate-50 to-blue-50 border-dashed border-2 border-slate-200 ${className}`}>
      <Icon className="h-16 w-16 mx-auto mb-6 text-slate-400" strokeWidth={1} />
      <h3 className="typography-h3 text-slate-900 mb-3">
        {title}
      </h3>
      <p className="typography-body text-slate-600 mb-6 max-w-md mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

export default EmptyState;
