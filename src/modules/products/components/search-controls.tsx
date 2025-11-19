import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, SortDesc } from 'lucide-react';

export const SearchControls = () => {
  return (
    <div className="flex gap-4 py-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input placeholder="Buscar productos..." className="pl-10" />
      </div>

      <Button variant="outline" className="flex items-center gap-2">
        <Filter className="w-4 h-4" />
        Filtros
      </Button>
      <Button variant="outline" className="flex items-center gap-2">
        <SortDesc className="w-4 h-4" />
        Ordenar por
      </Button>
    </div>
  );
};
