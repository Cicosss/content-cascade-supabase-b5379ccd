
import React from 'react';
import { Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useHeader } from '@/contexts/HeaderContext';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useNavigation } from '@/hooks/useNavigation';
import { createMenuItems, LOGO_CONFIG, Z_INDEX } from '@/config/navigationConfig';

export const MobileMenu: React.FC = () => {
  const { isMobileMenuOpen, setMobileMenuOpen } = useHeader();
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { handleNavigation, handleAuthNavigation } = useNavigation();
  const menuItems = createMenuItems();
  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
  };

  const displayName = profile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0];

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="touch"
          className="mr-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden text-slate-200 hover:text-white transition-all duration-200 active:scale-95"
          aria-label="Apri menu di navigazione"
        >
          <Menu className="h-7 w-7" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 bg-slate-900 border-slate-700 w-[85vw] max-w-80 z-dropdown overflow-y-auto">
        <div className="flex items-center space-x-2 pb-4 border-b border-slate-700">
          <img 
            src={LOGO_CONFIG.src} 
            alt={LOGO_CONFIG.alt} 
            className="h-12 w-auto object-contain"
          />
          <span className="font-bold text-white text-lg">Mia Romagna</span>
        </div>
        
        <div className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.items ? (
                  <AccordionItem value={`item-${index}`} className="border-b border-slate-700">
                    <AccordionTrigger className="text-base font-medium text-slate-200 hover:text-white py-4 hover:no-underline min-h-[48px] flex items-center transition-all duration-200 hover:bg-slate-800/30 rounded-md px-2 active:bg-slate-700">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-2">
                      <div className="flex flex-col space-y-2">
                        {item.items.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() => handleNavigation(subItem.url)}
                            className="flex items-start space-x-3 rounded-md p-4 min-h-[48px] text-sm hover:bg-slate-800 text-slate-200 hover:text-white text-left transition-all duration-200 group active:bg-slate-700 active:scale-98 touch-manipulation"
                          >
                            <div className="text-slate-400 group-hover:text-slate-300 mt-0.5 flex-shrink-0">
                              {subItem.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium">{subItem.title}</div>
                              {subItem.description && (
                                <div className="text-xs text-slate-400 group-hover:text-slate-300 mt-1 leading-relaxed">
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
                      onClick={() => handleNavigation(item.url)}
                      className="text-base font-medium text-slate-200 hover:text-white text-left w-full transition-all duration-200 hover:bg-slate-800/50 p-4 min-h-[48px] rounded-md active:bg-slate-700 active:scale-98 touch-manipulation"
                    >
                      {item.title}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </Accordion>
        </div>

        {/* Auth Section */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          {user ? (
            <div className="space-y-3">
              {/* User Profile Section */}
              <div className="flex items-center space-x-3 p-3 bg-slate-800/30 rounded-lg border border-slate-600/20">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {displayName}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full min-h-[48px] border-red-500/20 text-red-300 hover:bg-red-500/10 hover:text-red-200 hover:border-red-500/30 bg-transparent transition-all duration-200 active:scale-98 touch-manipulation"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Esci
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Login Button */}
              <Button
                onClick={() => handleAuthNavigation('/auth')}
                variant="outline"
                className="w-full min-h-[48px] border-blue-500/30 text-blue-300 hover:bg-blue-500/10 hover:text-blue-200 hover:border-blue-500/50 bg-transparent transition-all duration-200 active:scale-98 touch-manipulation"
              >
                <User className="h-4 w-4 mr-2" />
                Accedi
              </Button>
              
              {/* Register Button */}
              <Button
                onClick={() => handleAuthNavigation('/auth')}
                variant="outline"
                className="w-full min-h-[48px] border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200 hover:border-emerald-500/50 bg-transparent transition-all duration-200 active:scale-98 touch-manipulation"
              >
                <User className="h-4 w-4 mr-2" />
                Registrati
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
