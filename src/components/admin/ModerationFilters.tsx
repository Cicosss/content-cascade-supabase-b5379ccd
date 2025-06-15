
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
import { MACRO_AREAS, getAllCategories } from '@/config/categoryMapping';

interface ModerationFiltersProps {
  filters: {
    status: string;
    category: string;
    macroArea: string;
    searchTerm: string;
  };
  setFilters: (filters: any) => void;
}

const ModerationFilters: React.FC<ModerationFiltersProps> = ({ filters, setFilters }) => {
  const statusOptions = ['tutti', 'pending', 'approved', 'rejected', 'edited'];
  const allCategories = getAllCategories();
  const macroAreaOptions = ['tutti', ...Object.keys(MACRO_AREAS)];

  const updateFilter = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      status: 'tutti',
      category: 'tutti',
      macroArea: 'tutti',
      searchTerm: ''
    });
  };

  return (
    <Card className="p-6 mb-6 rounded-2xl border-0 shadow-lg bg-white/95 backdrop-blur-sm">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
          <Filter className="h-5 w-5 text-white" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          Filtri di Moderazione
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        
        {/* Ricerca testuale */}
        <div className="space-y-2">
          <Label className="font-semibold text-gray-700 flex items-center gap-2">
            <Search className="h-4 w-4" strokeWidth={1.5} />
            Cerca
          </Label>
          <Input
            placeholder="Nome, descrizione..."
            value={filters.searchTerm}
            onChange={(e) => updateFilter('searchTerm', e.target.value)}
            className="border-2"
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label className="font-semibold text-gray-700">Status</Label>
          <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
            <SelectTrigger className="border-2">
              <SelectValue placeholder="Seleziona status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status === 'tutti' ? 'Tutti' : status === 'pending' ? 'In Attesa' : 
                   status === 'approved' ? 'Approvati' : status === 'rejected' ? 'Rifiutati' : 'Modificati'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Macro-Area */}
        <div className="space-y-2">
          <Label className="font-semibold text-gray-700">Macro-Area</Label>
          <Select value={filters.macroArea} onValueChange={(value) => updateFilter('macroArea', value)}>
            <SelectTrigger className="border-2">
              <SelectValue placeholder="Seleziona macro-area" />
            </SelectTrigger>
            <SelectContent>
              {macroAreaOptions.map((macroArea) => (
                <SelectItem key={macroArea} value={macroArea}>
                  {macroArea === 'tutti' ? 'Tutte' : macroArea}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Categoria */}
        <div className="space-y-2">
          <Label className="font-semibold text-gray-700">Categoria</Label>
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger className="border-2">
              <SelectValue placeholder="Seleziona categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tutti">Tutte</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reset filtri */}
        <div className="space-y-2">
          <Label className="font-semibold text-gray-700 invisible">Reset</Label>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full border-2 hover:bg-red-50 hover:border-red-300"
          >
            Pulisci Filtri
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ModerationFilters;
