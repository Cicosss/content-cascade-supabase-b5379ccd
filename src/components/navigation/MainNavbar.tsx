import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Search, Menu, User, LogOut, Settings, PanelLeft, MessageSquare, LayoutDashboard, Trophy, Grid3X3, Droplets, CloudSun, Camera, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGuestRedirect } from '@/hooks/useGuestRedirect';
import { useScrollState } from '@/hooks/useScrollState';
import { MiaRomagnaSVGLogo } from '@/components/brand/MiaRomagnaSVGLogo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
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
  const { user } = useAuth();
  const { handleGuestClick } = useGuestRedirect();
  const { isScrolled } = useScrollState({ threshold: 50 });

  // Notify parent component when mobile menu state changes
  const handleMobileMenuChange = (open: boolean) => {
    setIsMobileMenuOpen(open);
    onMobileMenuChange?.(open);
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
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-white hover:text-primary transition-colors typography-small font-medium"
                onClick={(e) => {
                  if (handleGuestClick()) {
                    e.preventDefault();
                  }
                }}
              >
                {link.title}
              </Link>
            ))}

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
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="typography-small font-medium">{user.user_metadata?.full_name || user.email}</p>
                      <p className="w-[200px] truncate typography-caption text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profilo
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Impostazioni
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Esci
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white text-white hover:bg-white hover:text-slate-900"
                  asChild
                >
                  <Link to="/auth">Accedi</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
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
                  className="text-white hover:bg-white/10"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] sm:w-[400px] mobile-menu-overlay"
                style={{ zIndex: 999999 }}
              >
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
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">7</span>
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