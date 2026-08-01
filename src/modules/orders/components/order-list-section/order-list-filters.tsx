import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatLongDate } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { INVOICE_TYPES_ARRAY, ORDER_STATUS_OPTIONS_WITH_ALL } from '../../constants/order.constants';

import { useSalesChannel } from '@/hooks/query/sales-channel';
import type { GetOrdersFilters } from '../../interfaces/ui/get-orders-filters.interface';
import { getFilterDisplayValue } from '../../utils/order-list-filters.utils';

export type LocalOrderFilters = Omit<GetOrdersFilters, 'sortBy' | 'limit' | 'page'>;

export interface Props {
  urlFilters?: LocalOrderFilters;
  applyFilters: (filters: Partial<GetOrdersFilters>) => void;
}

export const OrderListFilters = ({ urlFilters = {}, applyFilters }: Props) => {
  const [draftFilters, setDraftFilters] = useState<LocalOrderFilters>(urlFilters);

  const { data: salesChannelOptions } = useSalesChannel();

  const updateLocalFilters = (newFilters: LocalOrderFilters) => {
    setDraftFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setDraftFilters({});
    applyFilters({});
  };

  const deleteFilter = (keyToDelete: keyof LocalOrderFilters) => {
    applyFilters({
      ...urlFilters,
      [keyToDelete]: undefined
    });
  };

  const draftFiltersCount = Object.values(draftFilters).filter(Boolean).length;

  const activeFiltersEntries = Object.entries(urlFilters).filter(
    ([key, value]) => Boolean(value) && key !== 'sortBy'
  ) as Array<[keyof LocalOrderFilters, string | Date]>;

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
                {salesChannelOptions && getFilterDisplayValue(key, value, salesChannelOptions)}
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
                disabled={draftFiltersCount <= 0}
                onClick={clearFilters}
                className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Limpiar todo
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Fecha de inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !draftFilters.startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {draftFilters.startDate ? formatLongDate(draftFilters.startDate) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={draftFilters.startDate}
                    defaultMonth={draftFilters.startDate}
                    captionLayout="dropdown"
                    startMonth={new Date(2021, 1)}
                    onSelect={(date) => updateLocalFilters({ startDate: date })}
                    disabled={(date) => (draftFilters.endDate ? date > draftFilters.endDate : false)}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !draftFilters.endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {draftFilters.endDate ? formatLongDate(draftFilters.endDate) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={draftFilters.endDate}
                    defaultMonth={draftFilters.endDate}
                    captionLayout="dropdown"
                    startMonth={new Date(2021, 1)}
                    onSelect={(date) => {
                      if (date) {
                        date.setHours(23, 59, 59, 999);
                      }
                      updateLocalFilters({ endDate: date });
                    }}
                    disabled={(date) => (draftFilters.startDate ? date < draftFilters.startDate : false)}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="space-y-2 w-full">
                <Label>Estado de la venta</Label>
                <Select
                  value={draftFilters.status ?? ''}
                  onValueChange={(value) => updateLocalFilters({ status: value })}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUS_OPTIONS_WITH_ALL.map((status) => (
                      <SelectItem key={status.key} value={status.key} className="cursor-pointer">
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <Label>Medio de venta</Label>
                <Select
                  value={draftFilters.channel ?? ''}
                  onValueChange={(value) => updateLocalFilters({ channel: value })}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Seleccionar medio" />
                  </SelectTrigger>
                  <SelectContent>
                    {salesChannelOptions &&
                      salesChannelOptions.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id.toString()} className="cursor-pointer">
                          {channel.channel}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 w-full">
              <Label>Tipo de comprobante</Label>
              <Select
                value={draftFilters.invoiceType ?? ''}
                onValueChange={(value) => updateLocalFilters({ invoiceType: value })}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Seleccionar tipo de comprobante" />
                </SelectTrigger>
                <SelectContent>
                  {INVOICE_TYPES_ARRAY.map(({ key, label }) => (
                    <SelectItem key={key} value={key} className="cursor-pointer">
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={() => applyFilters(draftFilters)}>
              Aplicar filtros
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
