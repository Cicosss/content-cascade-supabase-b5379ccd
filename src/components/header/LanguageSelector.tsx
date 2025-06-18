
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageSelector = () => {
  const languages = [
    { code: 'IT', flag: '🇮🇹', name: 'Italiano' },
    { code: 'EN', flag: '🇬🇧', name: 'English' },
    { code: 'DE', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'FR', flag: '🇫🇷', name: 'Français' },
    { code: 'ES', flag: '🇪🇸', name: 'Español' },
    { code: 'RU', flag: '🇷🇺', name: 'Русский' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="hidden sm:flex hover:bg-slate-700 hover:text-orange-300 rounded-lg text-sm text-white"
        >
          <Globe className="h-4 w-4 mr-1" />
          IT
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="rounded-lg border-slate-600 bg-slate-800/98 backdrop-blur-sm z-popover-custom"
      >
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            className="rounded-md text-sm text-white hover:bg-slate-700"
          >
            {lang.flag} {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
