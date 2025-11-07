import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Search, Menu, User, LogOut, Settings, PanelLeft, MessageSquare, LayoutDashboard, Trophy, Grid3X3, Droplets, CloudSun, Camera, Zap, Heart, Shield, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGuestRedirect } from '@/hooks/useGuestRedirect';
import { useScrollState } from '@/hooks/useScrollState';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { MiaRomagnaSVGLogo } from '@/components/brand/MiaRomagnaSVGLogo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Z_INDEX } from '@/config/zIndex';
import { cn } from '@/lib/utils';

// Safe Sidebar Trigger Component that uses custom events
const SafeSidebarTrigger = () => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        // Dispatch a custom event that the sidebar can listen to
        window.dispatchEvent(new CustomEvent('toggleSidebar'));
      }}
      className="relative z-10 h-9 w-9 rounded-md border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl"
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

interface MainNavbarProps {
  onMobileMenuChange?: (isOpen: boolean) => void;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ onMobileMenuChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { logoutAdmin, isAdmin } = useAdminAuth();
  const { handleNavigation } = useNavigation();
  const { handleGuestClick } = useGuestRedirect();
  const { isScrolled } = useScrollState({ threshold: 50 });

  const handleSignOut = async () => {
    await signOut();
    if (isAdmin) {
      logoutAdmin();
    }
    handleNavigation('/');
  };

  // Notify parent component and broadcast state changes
  const handleMobileMenuChange = (open: boolean) => {
    setIsMobileMenuOpen(open);
    onMobileMenuChange?.(open);
    // Broadcast to layouts to hide bottom nav when menu is open
    window.dispatchEvent(new CustomEvent('mobileMenuChange', { detail: { open } }));
  };

  // Check if we're in a page that has sidebar (when user is logged in)
  const hasSidebar = !!user;

  const navigationLinks = [
    { title: 'Il Mio Passaporto', href: '/my-passport' },
    { title: 'Respiro del Mare', href: '/respiro-del-mare' },
    { title: 'Oggi in Romagna', href: '/oggi' },
  ];

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 h-16 md:h-20 lg:h-24 transition-all duration-300",
        hasSidebar 
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg" 
          : (isScrolled 
            ? "bg-slate-900/95 backdrop-blur-md shadow-lg" 
            : "bg-transparent")
      )}
      style={{ zIndex: Z_INDEX.navbar }}
    >
      <div className="container mx-auto px-6 h-full flex items-center">
        <div className="flex items-center justify-between w-full">
          {/* Left Section - Sidebar Toggle + Logo */}
          <div className="flex items-center space-x-4">
            {/* Sidebar Toggle - Only visible when user is logged in and NOT on mobile */}
            {hasSidebar && (
              <div className="hidden md:block">
                <SafeSidebarTrigger />
              </div>
            )}
            
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <MiaRomagnaSVGLogo 
                size="navbar-version"
                theme="dark"
                linkable={true}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Direct Navigation Links */}
            {navigationLinks.map((link, index) => {
              const colors = ['border-blue-400', 'border-emerald-400', 'border-amber-400'];
              const hoverColors = ['hover:text-blue-400', 'hover:text-emerald-400', 'hover:text-amber-400'];
              
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`
                    relative text-white ${hoverColors[index]} transition-colors typography-small font-medium tracking-wide
                    after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 
                    after:${colors[index]} after:origin-bottom-right after:transition-transform after:duration-300 
                    hover:after:scale-x-100 hover:after:origin-bottom-left
                    ${window.location.pathname === link.href ? `after:scale-x-100 ${colors[index]}` : ''}
                  `}
                  onClick={(e) => {
                    if (handleGuestClick()) {
                      e.preventDefault();
                    }
                  }}
                >
                  {link.title}
                </Link>
              );
            })}

            {/* Language Selector */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Globe className="h-4 w-4" />
            </Button>

            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Authentication Controls */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 hover:border-orange-400/50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-slate-200 hover:text-orange-400"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} alt="Avatar" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="typography-small hidden sm:block font-medium">
                      {profile?.first_name || user.user_metadata?.first_name || user.email?.split('@')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-48 rounded-xl border border-slate-600/50 shadow-xl bg-slate-900 backdrop-blur-sm"
                  style={{ zIndex: Z_INDEX.dropdown }}
                >
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('/dashboard')}
                    className="typography-small rounded-lg hover:bg-white/10 cursor-pointer text-white focus:bg-white/10 focus:text-white"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-3 text-blue-200" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('/profile')}
                    className="typography-small rounded-lg hover:bg-white/10 cursor-pointer text-white focus:bg-white/10 focus:text-white"
                  >
                    <Settings className="h-4 w-4 mr-3 text-emerald-200" />
                    Il Mio Profilo
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleNavigation('/favorites')}
                    className="typography-small rounded-lg hover:bg-white/10 cursor-pointer text-white focus:bg-white/10 focus:text-white"
                  >
                    <Heart className="h-4 w-4 mr-3 text-red-200" />
                    Preferiti
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuItem 
                        onClick={() => handleNavigation('/admin')}
                        className="typography-small rounded-lg hover:bg-orange-500/20 cursor-pointer text-orange-200 hover:text-orange-100 focus:bg-orange-500/20 focus:text-orange-100"
                      >
                        <Shield className="h-4 w-4 mr-3" />
                        Pannello Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleNavigation('/admin-roles')}
                        className="typography-small rounded-lg hover:bg-purple-500/20 cursor-pointer text-purple-200 hover:text-purple-100 focus:bg-purple-500/20 focus:text-purple-100"
                      >
                        <Users className="h-4 w-4 mr-3" />
                        Gestione Ruoli
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={logoutAdmin}
                        className="typography-small rounded-lg hover:bg-yellow-500/20 cursor-pointer text-yellow-200 hover:text-yellow-100 focus:bg-yellow-500/20 focus:text-yellow-100"
                      >
                        <Shield className="h-4 w-4 mr-3" />
                        Esci da Admin
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="typography-small rounded-lg hover:bg-red-500/20 text-red-200 hover:text-red-100 cursor-pointer focus:bg-red-500/20 focus:text-red-100"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Esci
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white text-white hover:bg-white hover:text-slate-900 typography-small font-medium tracking-wide"
                  asChild
                >
                  <Link to="/auth">Accedi</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 hover:text-white typography-small font-medium tracking-wide border border-transparent hover:border-white/30"
                  asChild
                >
                  <Link to="/auth">Registrati</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={handleMobileMenuChange}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm" 
                  className="mobile-menu-trigger text-white hover:bg-white/10 min-h-[48px] min-w-[48px]"
                  data-mobile-menu="true"
                  style={{ 
                    position: 'relative',
                    zIndex: Z_INDEX.navbarButton,
                    touchAction: 'manipulation',
                    pointerEvents: 'auto'
                  }}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-[380px] md:w-[420px] lg:w-[480px] bg-background/95 backdrop-blur-md border-l border-white/10"
              >
                {/* A11y: Title/Description per il dialog Sheet */}
                <SheetHeader className="sr-only">
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>Navigazione principale</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Special Item - Oggi in Romagna with badge */}
                  {user && (
                    <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-lg p-3 border border-yellow-500/20">
                      <Link
                        to="/oggi"
                        className="flex items-center space-x-3 text-yellow-600 hover:text-yellow-700 transition-colors"
                        onClick={() => handleMobileMenuChange(false)}
                      >
                        <Zap className="h-5 w-5" />
                        <span className="typography-small font-medium">Oggi in Romagna</span>
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full typography-caption font-medium">7</span>
                      </Link>
                    </div>
                  )}

                  {/* Main Navigation Items */}
                  <div className="space-y-1">
                    {user && (
                      <>
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors typography-small font-medium"
                          onClick={() => handleMobileMenuChange(false)}
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/my-passport"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors typography-small font-medium"
                          onClick={() => handleMobileMenuChange(false)}
                        >
                          <Trophy className="h-4 w-4" />
                          <span>Il Mio Passaporto</span>
                        </Link>
                        <Link
                          to="/categories"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors typography-small font-medium"
                          onClick={(e) => {
                            if (handleGuestClick()) {
                              e.preventDefault();
                            } else {
                              handleMobileMenuChange(false);
                            }
                          }}
                        >
                          <Grid3X3 className="h-4 w-4" />
                          <span>Esplora Categorie</span>
                        </Link>
                        <Link
                          to="/water-quality"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors typography-small font-medium"
                          onClick={(e) => {
                            if (handleGuestClick()) {
                              e.preventDefault();
                            } else {
                              handleMobileMenuChange(false);
                            }
                          }}
                        >
                          <Droplets className="h-4 w-4" />
                          <span>Qualità del Mare</span>
                        </Link>
                        <Link
                          to="/weather"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors typography-small font-medium"
                          onClick={(e) => {
                            if (handleGuestClick()) {
                              e.preventDefault();
                            } else {
                              handleMobileMenuChange(false);
                            }
                          }}
                        >
                          <CloudSun className="h-4 w-4" />
                          <span>Meteo</span>
                        </Link>
                        <Link
                          to="/webcams"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors typography-small font-medium"
                          onClick={(e) => {
                            if (handleGuestClick()) {
                              e.preventDefault();
                            } else {
                              handleMobileMenuChange(false);
                            }
                          }}
                        >
                          <Camera className="h-4 w-4" />
                          <span>Webcam</span>
                        </Link>
                      </>
                    )}

                    {/* Public Navigation Links */}
                    <Link
                      to="/respiro-del-mare"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors typography-small font-medium"
                      onClick={(e) => {
                        if (handleGuestClick()) {
                          e.preventDefault();
                        } else {
                          handleMobileMenuChange(false);
                        }
                      }}
                    >
                      <Droplets className="h-4 w-4" />
                      <span>Respiro del Mare</span>
                    </Link>
                  </div>

                  {/* Mobile Auth Section */}
                  {user ? (
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-center space-x-3 p-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="typography-small font-medium">{user.user_metadata?.full_name || user.email}</p>
                          <p className="typography-caption text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="block p-3 rounded-lg hover:bg-accent transition-colors typography-small"
                         onClick={() => handleMobileMenuChange(false)}
                      >
                        Profilo
                      </Link>
                      <Link
                        to="/settings"
                        className="block p-3 rounded-lg hover:bg-accent transition-colors typography-small"
                         onClick={() => handleMobileMenuChange(false)}
                      >
                        Impostazioni
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-3 h-auto typography-small"
                        onClick={() => { signOut(); handleMobileMenuChange(false); }}
                      >
                        Esci
                      </Button>
                    </div>
                  ) : (
                    <div className="border-t pt-4 space-y-3">
                      <Button
                        variant="outline"
                        className="w-full"
                        asChild
                      >
                         <Link to="/auth" onClick={() => handleMobileMenuChange(false)}>
                          Accedi
                        </Link>
                      </Button>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        asChild
                      >
                        <Link to="/auth" onClick={() => handleMobileMenuChange(false)}>
                          Registrati
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavbar;