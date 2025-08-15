
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
          className="mr-2 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden text-slate-200 hover:text-orange-400 transition-all duration-300 active:scale-95 relative group"
          aria-label="Apri menu di navigazione"
        >
          <Menu className="h-7 w-7 transition-transform duration-300 group-hover:rotate-90" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 border-slate-600/50 w-[85vw] max-w-80 z-dropdown overflow-y-auto relative">
        {/* Geometric Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-6 w-20 h-20 border border-orange-400 rotate-45"></div>
          <div className="absolute bottom-40 right-8 w-16 h-16 bg-blue-500/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-green-400 rotate-12"></div>
        </div>
        
        <div className="flex items-center space-x-3 pb-6 border-b border-slate-600/50 relative z-10">
          <div className="group">
            <img 
              src={LOGO_CONFIG.src} 
              alt={LOGO_CONFIG.alt} 
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <span className="font-bold text-white text-lg tracking-wide">Mia Romagna</span>
        </div>
        
        <div className="mt-6 relative z-10">
          <Accordion type="single" collapsible className="w-full">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.items ? (
                  <AccordionItem value={`item-${index}`} className="border-b border-slate-600/50">
                    <AccordionTrigger className="text-base font-semibold text-slate-200 hover:text-orange-400 py-4 hover:no-underline min-h-[48px] flex items-center transition-all duration-300 hover:bg-slate-800/30 rounded-lg px-3 active:bg-slate-700 relative group">
                      {item.title}
                      <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-3">
                      <div className="flex flex-col space-y-2">
                        {item.items.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() => handleNavigation(subItem.url)}
                            className="flex items-start space-x-3 rounded-lg p-4 min-h-[48px] text-sm hover:bg-slate-700/50 text-slate-200 hover:text-white text-left transition-all duration-300 group active:bg-slate-600 active:scale-98 touch-manipulation border border-transparent hover:border-slate-600/30"
                          >
                            <div className="text-slate-400 group-hover:text-orange-400 mt-0.5 flex-shrink-0 transition-colors duration-300">
                              {subItem.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-medium tracking-wide">{subItem.title}</div>
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
                  <div className="border-b border-slate-600/50 py-3">
                    <button
                      onClick={() => handleNavigation(item.url)}
                      className="text-base font-semibold text-slate-200 hover:text-orange-400 text-left w-full transition-all duration-300 hover:bg-slate-800/30 p-4 min-h-[48px] rounded-lg active:bg-slate-700 active:scale-98 touch-manipulation relative group"
                    >
                      {item.title}
                      <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </Accordion>
        </div>

        {/* Auth Section */}
        <div className="mt-8 pt-6 border-t border-slate-600/50 relative z-10">
          {user ? (
            <div className="space-y-4">
              {/* User Profile Section */}
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30 backdrop-blur-sm">
                <Avatar className="w-12 h-12 ring-2 ring-orange-400/20">
                  <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate tracking-wide">
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
                className="w-full min-h-[48px] border-red-500/30 text-red-300 hover:bg-red-500/20 hover:text-red-200 hover:border-red-500/50 bg-transparent transition-all duration-300 active:scale-98 touch-manipulation font-medium tracking-wide shadow-lg hover:shadow-red-500/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Esci
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Login Button */}
              <Button
                onClick={() => handleAuthNavigation('/auth')}
                variant="outline"
                className="w-full min-h-[48px] border-orange-500/30 text-orange-300 hover:bg-orange-500/20 hover:text-orange-200 hover:border-orange-500/50 bg-transparent transition-all duration-300 active:scale-98 touch-manipulation font-medium tracking-wide shadow-lg hover:shadow-orange-500/20 relative group"
              >
                <User className="h-4 w-4 mr-2" />
                Accedi
                <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-orange-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
              </Button>
              
              {/* Register Button */}
              <Button
                onClick={() => handleAuthNavigation('/auth')}
                className="w-full min-h-[48px] bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 active:scale-98 touch-manipulation font-semibold tracking-wide shadow-lg hover:shadow-orange-500/25 hover:scale-105"
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
