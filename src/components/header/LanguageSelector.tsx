
import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageSelector = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors duration-200"
        >
          <Globe className="h-4 w-4 mr-2" />
          IT
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[5001]">
        <DropdownMenuItem>
          🇮🇹 Italiano
        </DropdownMenuItem>
        <DropdownMenuItem>
          🇬🇧 English
        </DropdownMenuItem>
        <DropdownMenuItem>
          🇩🇪 Deutsch
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
