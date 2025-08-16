import React, { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Globe, Search, Menu, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGuestRedirect } from '@/hooks/useGuestRedirect';
import { useScrollState } from '@/hooks/useScrollState';
import { heroCategories } from '@/components/hero/heroCategories';
import { BrandLogotype } from '@/components/brand/BrandLogotype';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
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

  const navigationLinks = [
    { title: 'Il Mio Passaporto', href: '/my-passport' },
    { title: 'Respiro del Mare', href: '/respiro' },
    { title: 'Oggi in Romagna', href: '/oggi' },
  ];

  return (
    <nav className={cn(
      `fixed top-0 left-0 right-0 z-[${Z_INDEX.navbar}] transition-all duration-300`,
      isScrolled 
        ? "bg-slate-900/95 backdrop-blur-md shadow-lg" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <BrandLogotype 
              size="navbar-version"
              theme="light"
              linkable={true}
              className="text-white"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Scopri Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white bg-transparent hover:bg-white/10 data-[active]:bg-white/10 data-[state=open]:bg-white/10">
                    Scopri
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-6">
                      <div className="grid gap-4">
                        {heroCategories.map((category) => (
                          <Link
                            key={category.id}
                            to={category.route}
                            className="group block p-3 rounded-lg hover:bg-accent transition-colors"
                          >
                            <div className="font-medium text-foreground group-hover:text-accent-foreground">
                              {category.title}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {category.subtitle}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Direct Navigation Links */}
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-white hover:text-primary transition-colors text-sm font-medium"
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
                      <p className="font-medium">{user.user_metadata?.full_name || user.email}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
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
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
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
              <SheetContent side="right" className={`w-[300px] sm:w-[400px] z-[${Z_INDEX.sheet}]`}>
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Scopri Section */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-foreground">Scopri</h3>
                    {heroCategories.map((category) => (
                      <Link
                        key={category.id}
                        to={category.route}
                        className="block p-3 rounded-lg hover:bg-accent transition-colors"
                        onClick={() => handleMobileMenuChange(false)}
                      >
                        <div className="font-medium text-sm">{category.title}</div>
                        <div className="text-xs text-muted-foreground">{category.subtitle}</div>
                      </Link>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        className="block p-3 rounded-lg hover:bg-accent transition-colors font-medium text-sm"
                        onClick={(e) => {
                          if (handleGuestClick()) {
                            e.preventDefault();
                          } else {
                            handleMobileMenuChange(false);
                          }
                        }}
                      >
                        {link.title}
                      </Link>
                    ))}
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
                          <p className="font-medium text-sm">{user.user_metadata?.full_name || user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="block p-3 rounded-lg hover:bg-accent transition-colors text-sm"
                         onClick={() => handleMobileMenuChange(false)}
                      >
                        Profilo
                      </Link>
                      <Link
                        to="/settings"
                        className="block p-3 rounded-lg hover:bg-accent transition-colors text-sm"
                         onClick={() => handleMobileMenuChange(false)}
                      >
                        Impostazioni
                      </Link>
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-3 h-auto text-sm"
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