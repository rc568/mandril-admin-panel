import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllCatalogs } from '@/services/catalog/get-all-catalogs.action';
import { getAllCategories } from '@/services/category/get-all-categories.action';
import { useQuery } from '@tanstack/react-query';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';
import type { GetProductsQueryParams } from '../interfaces/get-products.interface';
import { getFilterDisplayValue } from '../utils/product-list-filters.utils';

export type LocalProductsFilters = Pick<
  GetProductsQueryParams,
  'catalogId' | 'categoryId' | 'isActive' | 'minPrice' | 'maxPrice'
>;

export interface Props {
  initialFilters?: LocalProductsFilters;
  applyFilters: (filters: Partial<GetProductsQueryParams>) => void;
}

export const ProductListFilters = ({ initialFilters = {}, applyFilters }: Props) => {
  const [localFilters, setLocalFilters] = useState<LocalProductsFilters>(initialFilters);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllCategories,
    staleTime: 1000 * 60 * 60
  });

  const { data: catalogs } = useQuery({
    queryKey: ['catalogs'],
    queryFn: getAllCatalogs,
    staleTime: 1000 * 60 * 60
  });

  const updateLocalFilters = (newFilters: LocalProductsFilters) => {
    setLocalFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setLocalFilters({});
    applyFilters({});
  };

  const deleteFilter = (keyToDelete: keyof LocalProductsFilters) => {
    applyFilters({
      ...initialFilters,
      [keyToDelete]: undefined
    });
  };

  const localFiltersCount = Object.values(localFilters).filter(Boolean).length;

  const activeFiltersEntries = Object.entries(initialFilters).filter(
    ([key, value]) => Boolean(value) && key !== 'sortBy'
  ) as Array<[keyof LocalProductsFilters, string | Date]>;

  return (
    <div className="flex gap-2 justify-between items-center grow">
      <div className="grow flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {activeFiltersEntries.length === 0 ? (
          <span className="text-sm text-foreground">No hay filtros activos</span>
        ) : (
          <>
            <span className="text-sm font-semibold">Filtros activos: </span>
            {activeFiltersEntries.map(([key, value]) => (
              <Badge variant={'outline'} className="text-sm font-normal bg-gray-100" key={value.toString()}>
                {catalogs && categories && getFilterDisplayValue(key, value, catalogs, categories)}
                <Button variant={'ghost'} size={'icon-xs'} onClick={() => deleteFilter(key)}>
                  <X />
                </Button>
              </Badge>
            ))}
          </>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <Filter />
            Filtros de búsqueda
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="end">
          <div className="px-4 py-2 space-y-4">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                disabled={localFiltersCount <= 0}
                onClick={clearFilters}
                className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Limpiar todo
              </Button>
            </div>

            <div className="space-y-2 w-full">
              <Label>Catálogo</Label>
              <Select
                value={localFilters.catalogId ?? ''}
                onValueChange={(value) => updateLocalFilters({ catalogId: value })}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Seleccionar catálogo" />
                </SelectTrigger>
                <SelectContent>
                  {catalogs &&
                    catalogs.map((catalog) => (
                      <SelectItem key={catalog.id} value={catalog.id.toString()} className="cursor-pointer">
                        {catalog.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-full">
              <Label>Categoría</Label>
              <Select
                value={localFilters.categoryId ?? ''}
                onValueChange={(value) => updateLocalFilters({ categoryId: value })}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories &&
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()} className="cursor-pointer">
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 w-full">
              <Label>Visibilidad</Label>
              <Select value={localFilters.isActive} onValueChange={(value) => updateLocalFilters({ isActive: value })}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Visibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">No Activo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Precio de Venta</Label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                    S/
                  </span>
                  <Input
                    type="number"
                    placeholder="Mínimo"
                    value={localFilters.minPrice ?? ''}
                    onChange={(e) => updateLocalFilters({ minPrice: e.target.value })}
                    className="w-full pl-8"
                    min={0}
                  />
                </div>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
                    S/
                  </span>
                  <Input
                    type="number"
                    placeholder="Máximo"
                    value={localFilters.maxPrice ?? ''}
                    onChange={(e) => updateLocalFilters({ maxPrice: e.target.value })}
                    className="w-full pl-8"
                    min={0}
                  />
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={() => applyFilters(localFilters)}>
              Aplicar filtros
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
