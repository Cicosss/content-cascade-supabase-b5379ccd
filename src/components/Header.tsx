
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  User, 
  Menu,
  X,
  MapPin,
  Mountain
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

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 shadow-lg">
              <Mountain className="h-7 w-7 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Mia Romagna
              </h1>
              <p className="text-sm text-gray-500 -mt-1">Scopri la bellezza</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link to="/experiences" className="px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium">
              Esperienze
            </Link>
            <Link to="/events" className="px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium">
              Eventi
            </Link>
            <Link to="/restaurants" className="px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium">
              Ristoranti
            </Link>
            <Link to="/itineraries" className="px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium">
              Itinerari
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-emerald-50 hover:text-emerald-600 rounded-xl">
                  <Globe className="h-4 w-4 mr-2" />
                  IT
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-gray-200/50">
                <DropdownMenuItem className="rounded-lg">🇮🇹 Italiano</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg">🇬🇧 English</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg">🇩🇪 Deutsch</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg">🇫🇷 Français</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg">🇪🇸 Español</DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg">🇷🇺 Русский</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {user ? (
              <ProfileMenu />
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-6"
              >
                <User className="h-4 w-4 mr-2" />
                Accedi
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-emerald-50 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200/50">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/experiences" 
                className="px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Esperienze
              </Link>
              <Link 
                to="/events" 
                className="px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Eventi
              </Link>
              <Link 
                to="/restaurants" 
                className="px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Ristoranti
              </Link>
              <Link 
                to="/itineraries" 
                className="px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Itinerari
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
