
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  User, 
  Menu,
  X,
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
    <header className="sticky top-0 z-50 w-full bg-white/98 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 shadow-md">
              <Mountain className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-900">
                Mia Romagna
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link to="/experiences" className="px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium text-sm">
              Cosa fare
            </Link>
            <Link to="/restaurants" className="px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium text-sm">
              Dove mangiare
            </Link>
            <Link to="/itineraries" className="px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium text-sm">
              Dove dormire
            </Link>
            <Link to="/events" className="px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium text-sm">
              Eventi
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-slate-50 hover:text-slate-900 rounded-lg text-sm">
                  <Globe className="h-4 w-4 mr-1" />
                  IT
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-lg border-slate-200/60 bg-white/98 backdrop-blur-sm">
                <DropdownMenuItem className="rounded-md text-sm">🇮🇹 Italiano</DropdownMenuItem>
                <DropdownMenuItem className="rounded-md text-sm">🇬🇧 English</DropdownMenuItem>
                <DropdownMenuItem className="rounded-md text-sm">🇩🇪 Deutsch</DropdownMenuItem>
                <DropdownMenuItem className="rounded-md text-sm">🇫🇷 Français</DropdownMenuItem>
                <DropdownMenuItem className="rounded-md text-sm">🇪🇸 Español</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {user ? (
              <ProfileMenu />
            ) : (
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm px-4 py-2 h-9 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <User className="h-4 w-4 mr-2" />
                Accedi
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200/60">
            <nav className="flex flex-col space-y-1">
              <Link 
                to="/experiences" 
                className="px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cosa fare
              </Link>
              <Link 
                to="/restaurants" 
                className="px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dove mangiare
              </Link>
              <Link 
                to="/itineraries" 
                className="px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dove dormire
              </Link>
              <Link 
                to="/events" 
                className="px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200 font-medium text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Eventi
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
