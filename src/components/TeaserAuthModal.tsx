
import React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import { getTeaserContent } from './teaser-modal/TeaserModalContent';
import TeaserModalHeader from './teaser-modal/TeaserModalHeader';
import TeaserModalBenefits from './teaser-modal/TeaserModalBenefits';
import TeaserModalActions from './teaser-modal/TeaserModalActions';

interface TeaserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'offers' | 'passport' | 'weather';
}

const TeaserAuthModal: React.FC<TeaserAuthModalProps> = ({ 
  isOpen, 
  onClose, 
  variant = 'offers' 
}) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth?mode=login');
    onClose();
  };

  const handleSignup = () => {
    navigate('/auth?mode=signup');
    onClose();
  };

  const content = getTeaserContent(variant);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden">
        <TeaserModalHeader content={content} variant={variant} />

        <div className="p-8">
          <TeaserModalBenefits benefits={content.benefits} variant={variant} />
          <TeaserModalActions 
            content={content} 
            variant={variant} 
            onSignup={handleSignup} 
            onLogin={handleLogin} 
          />

          {/* Footer del Modal */}
          <div className="text-center mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              {content.footerText}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeaserAuthModal;
