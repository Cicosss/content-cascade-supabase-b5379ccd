
import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { languages } from '@/constants/navigation';

const LanguageSelector = React.memo(() => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="hidden sm:flex hover:bg-slate-700 hover:text-orange-300 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-slate-800"
          aria-label="Seleziona lingua"
        >
          <Globe className="h-4 w-4 mr-1" />
          IT
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="rounded-lg border-slate-600 bg-slate-800/98 backdrop-blur-sm z-popover-custom"
        role="menu"
        aria-label="Opzioni lingua"
      >
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            className="rounded-md text-sm text-white hover:bg-slate-700 focus:bg-slate-700 focus:outline-none"
            role="menuitem"
            tabIndex={0}
          >
            {lang.flag} {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

LanguageSelector.displayName = 'LanguageSelector';

export default LanguageSelector;
