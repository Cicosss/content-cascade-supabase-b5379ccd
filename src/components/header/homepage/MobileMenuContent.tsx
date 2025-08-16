import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigation } from '@/hooks/useNavigation';
import { createMenuItems } from '@/config/navigationConfig';
import { BrandLogotype } from '@/components/brand/BrandLogotype';

interface MobileMenuContentProps {
  onClose: () => void;
}

export const MobileMenuContent: React.FC<MobileMenuContentProps> = React.memo(({ onClose }) => {
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { handleNavigation } = useNavigation();
  const menuItems = React.useMemo(() => createMenuItems(), []);
  
  const handleSignOut = React.useCallback(async () => {
    await signOut();
    onClose();
  }, [signOut, onClose]);

  const handleNavClick = React.useCallback((url: string) => {
    handleNavigation(url);
    onClose();
  }, [handleNavigation, onClose]);

  const displayName = profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-700">
        <div className="group">
          <BrandLogotype 
            size="small"
            theme="dark"
            linkable={false}
          />
        </div>
        <span className="typography-h4 text-white tracking-wide">Mia Romagna</span>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 mt-6 overflow-y-auto">
        <Accordion type="single" collapsible className="w-full">
          {menuItems.map((item, index) => (
            <div key={index}>
              {item.items ? (
                <AccordionItem value={`item-${index}`} className="border-b border-slate-700">
                  <AccordionTrigger className="typography-small font-semibold text-white hover:text-primary py-4 hover:no-underline min-h-[48px] flex items-center transition-all duration-300 hover:bg-slate-800/50 rounded-lg px-3 active:bg-slate-800 relative group">
                    {item.title}
                    <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <div className="flex flex-col space-y-2">
                      {item.items.map((subItem, subIndex) => (
                         <button
                           key={subIndex}
                           onClick={() => handleNavClick(subItem.url)}
                           className="typography-small flex items-start space-x-3 rounded-lg p-4 min-h-[48px] hover:bg-slate-800/50 text-slate-200 hover:text-white text-left transition-all duration-300 group active:bg-slate-800 active:scale-98 touch-manipulation border border-transparent hover:border-slate-600"
                         >
                          <div className="text-slate-400 group-hover:text-primary mt-0.5 flex-shrink-0 transition-colors duration-300">
                            {subItem.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="typography-small font-medium tracking-wide">{subItem.title}</div>
                            {subItem.description && (
                              <div className="typography-caption text-slate-400 group-hover:text-slate-200 mt-1 leading-relaxed">
                                {subItem.description}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div className="border-b border-slate-700 py-3">
                   <button
                     onClick={() => handleNavClick(item.url)}
                     className="typography-small font-semibold text-white hover:text-primary text-left w-full transition-all duration-300 hover:bg-slate-800/50 p-4 min-h-[48px] rounded-lg active:bg-slate-800 active:scale-98 touch-manipulation relative group"
                   >
                    {item.title}
                    <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  </button>
                </div>
              )}
            </div>
          ))}
        </Accordion>
      </div>

      {/* Auth Section */}
      <div className="mt-8 pt-6 border-t border-slate-700">
        {user ? (
          <div className="space-y-4">
            {/* User Profile Section */}
            <div className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700 backdrop-blur-sm">
              <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
                <AvatarFallback className="bg-gradient-to-br from-primary to-destructive text-primary-foreground">
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="typography-small font-semibold text-white truncate tracking-wide">
                  {displayName}
                </div>
                <div className="typography-caption text-slate-400 truncate">
                  {user.email}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full min-h-[48px] border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/50 bg-transparent transition-all duration-300 active:scale-98 touch-manipulation font-medium tracking-wide"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Esci
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Login Button */}
             <Button
               onClick={() => handleNavClick('/auth')}
               variant="outline"
               className="w-full min-h-[48px] border-primary/30 text-primary hover:bg-primary/20 hover:text-primary hover:border-primary/50 bg-transparent transition-all duration-300 active:scale-98 touch-manipulation font-medium tracking-wide relative group"
             >
              <User className="h-4 w-4 mr-2" />
              Accedi
              <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
            </Button>
            
            {/* Register Button */}
             <Button
               onClick={() => handleNavClick('/auth')}
               className="w-full min-h-[48px] bg-gradient-to-r from-primary to-destructive text-primary-foreground hover:from-primary/90 hover:to-destructive/90 transition-all duration-300 active:scale-98 touch-manipulation font-semibold tracking-wide hover:scale-105"
             >
              <User className="h-4 w-4 mr-2" />
              Registrati
            </Button>
          </div>
        )}
      </div>
    </div>
  );
});

MobileMenuContent.displayName = 'MobileMenuContent';