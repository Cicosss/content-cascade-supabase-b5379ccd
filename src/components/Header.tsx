
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  User, 
  Menu,
  X,
  UserPlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ProfileMenu from './ProfileMenu';
import MiaRomagnaLogo from './MiaRomagnaLogo';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-700/60 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Left section with logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <MiaRomagnaLogo width={120} height={40} />
              <div className="hidden sm:block">
                <p className="text-xs text-slate-300 italic">"Il territorio è tra le Tue mani"</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link to="/experiences" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium text-sm">
              Tradizione Culinaria
            </Link>
            <Link to="/restaurants" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium text-sm">
              Esperienze del Territorio
            </Link>
            <Link to="/events" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium text-sm">
              Eventi Speciali
            </Link>
            <Link to="/family" className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium text-sm">
              Sezione Family
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-slate-700/50 hover:text-white rounded-lg text-sm text-slate-300">
                  <Globe className="h-4 w-4 mr-1" />
                  IT
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-lg border-slate-600 bg-slate-800/98 backdrop-blur-sm">
                <DropdownMenuItem className="rounded-md text-sm text-white hover:bg-slate-700">🇮🇹 Italiano</DropdownMenuItem>
                <DropdownMenuItem className="rounded-md text-sm text-white hover:bg-slate-700">🇬🇧 English</DropdownMenuItem>
                <DropdownMenuItem className="rounded-md text-sm text-white hover:bg-slate-700">🇩🇪 Deutsch</DropdownMenuItem>
                <DropdownMenuItem className="rounded-md text-sm text-white hover:bg-slate-700">🇫🇷 Français</DropdownMenuItem>
                <DropdownMenuItem className="rounded-md text-sm text-white hover:bg-slate-700">🇪🇸 Español</DropdownMenuItem>
                <DropdownMenuItem className="rounded-md text-sm text-white hover:bg-slate-700">🇷🇺 Русский</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Buttons */}
            {user ? (
              <ProfileMenu />
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => navigate('/auth?mode=login')}
                  className="brand-blue-gradient text-white hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-700 text-sm px-4 py-2 h-9 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                >
                  <User className="h-4 w-4 mr-2" />
                  Accedi Gratis
                </Button>
                <Button 
                  onClick={() => navigate('/auth?mode=signup')}
                  className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400 text-white text-sm px-4 py-2 h-9 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Registrati
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-slate-700/50 rounded-lg text-slate-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-700/60">
            <nav className="flex flex-col space-y-1">
              <Link 
                to="/experiences" 
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tradizione Culinaria
              </Link>
              <Link 
                to="/restaurants" 
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Esperienze del Territorio
              </Link>
              <Link 
                to="/events" 
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Eventi Speciali
              </Link>
              <Link 
                to="/family" 
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 font-medium text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sezione Family
              </Link>
            </nav>

            {/* Mobile Auth Buttons */}
            {!user && (
              <div className="flex flex-col space-y-2 mt-4 px-4">
                <Button 
                  onClick={() => {
                    navigate('/auth?mode=login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="brand-blue-gradient text-white hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-700 text-sm w-full shadow-md hover:shadow-lg transition-all duration-300 font-medium"
                >
                  <User className="h-4 w-4 mr-2" />
                  Accedi Gratis
                </Button>
                <Button 
                  onClick={() => {
                    navigate('/auth?mode=signup');
                    setIsMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400 text-white text-sm w-full"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Registrati
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
