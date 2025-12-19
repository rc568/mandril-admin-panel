import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatLongDate } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import { getAllSalesChannel } from '@/services/sales-channel/get-all-sales-channel.action';
import { useQuery } from '@tanstack/react-query';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { INVOICE_TYPES_ARRAY, ORDER_STATUS_OPTIONS_WITH_ALL } from '../constants/order.constants';
import type { GetOrdersQueryParams } from '../interfaces/get-orders.interface';
import { getFilterDisplayValue } from '../utils/order-list-filters.utils';

export type LocalOrderFilters = Pick<
  GetOrdersQueryParams,
  'status' | 'channel' | 'startDate' | 'endDate' | 'invoiceType'
>;

export interface Props {
  initialFilters?: LocalOrderFilters;
  applyFilters: (filters: Partial<GetOrdersQueryParams>) => void;
}

export const OrderListFilters = ({ initialFilters = {}, applyFilters }: Props) => {
  const [localFilters, setLocalFilters] = useState<LocalOrderFilters>(initialFilters);

  const { data: salesChannelOptions } = useQuery({
    queryKey: ['sales-channel'],
    queryFn: getAllSalesChannel,
    staleTime: 1000 * 60 * 60
  });

  const updateLocalFilters = (newFilters: LocalOrderFilters) => {
    setLocalFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setLocalFilters({});
    applyFilters({});
  };

  const deleteFilter = (keyToDelete: keyof LocalOrderFilters) => {
    applyFilters({
      ...initialFilters,
      [keyToDelete]: undefined
    });
  };

  const localFiltersCount = Object.values(localFilters).filter(Boolean).length;

  const activeFiltersEntries = Object.entries(initialFilters).filter(
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
                disabled={localFiltersCount <= 0}
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
                      !localFilters.startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.startDate ? formatLongDate(localFilters.startDate) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.startDate}
                    defaultMonth={localFilters.startDate}
                    captionLayout="dropdown"
                    startMonth={new Date(2021, 1)}
                    onSelect={(date) => updateLocalFilters({ startDate: date })}
                    disabled={(date) => (localFilters.endDate ? date > localFilters.endDate : false)}
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
                      !localFilters.endDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.endDate ? formatLongDate(localFilters.endDate) : <span>Seleccionar fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.endDate}
                    defaultMonth={localFilters.endDate}
                    captionLayout="dropdown"
                    startMonth={new Date(2021, 1)}
                    onSelect={(date) => {
                      if (date) {
                        date.setHours(23, 59, 59, 999);
                      }
                      updateLocalFilters({ endDate: date });
                    }}
                    disabled={(date) => (localFilters.startDate ? date < localFilters.startDate : false)}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="space-y-2 w-full">
                <Label>Estado de la venta</Label>
                <Select
                  value={localFilters.status ?? ''}
                  onValueChange={(value) => updateLocalFilters({ status: value })}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUS_OPTIONS_WITH_ALL.map((status) => (
                      <SelectItem key={status.key} value={status.key} className="cursor-pointer">
                        {status.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 w-full">
                <Label>Medio de venta</Label>
                <Select
                  value={localFilters.channel ?? ''}
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
                value={localFilters.invoiceType ?? ''}
                onValueChange={(value) => updateLocalFilters({ invoiceType: value })}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Seleccionar tipo de comprobante" />
                </SelectTrigger>
                <SelectContent>
                  {INVOICE_TYPES_ARRAY.map(({ key, value }) => (
                    <SelectItem key={key} value={key} className="cursor-pointer">
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
