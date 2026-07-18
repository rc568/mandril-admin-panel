import { FormErrorMessage } from '@/components/common/form-error-message';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSalesChannel } from '@/hooks/query/sales-channel';
import { cn } from '@/lib/utils';
import { RotateCw } from 'lucide-react';
import { useController, type Control, type FieldErrors, type FieldValues, type Path } from 'react-hook-form';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  errors?: FieldErrors<T>;
}

export const SalesChannelSelectInput = <T extends FieldValues>({ control, name, errors }: Props<T>) => {
  const { data: salesChannel, isError, isPending, isFetching, refetch } = useSalesChannel();
  const { field } = useController({ name: name, control: control });

  if (isError) {
    return (
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground flex items-center gap-2">Canal de venta</span>
        <span className="text-destructive/85 text-sm">Error al cargar los canales de venta.</span>
        <div className="flex justify-between items-center border-destructive/35 border h-8 pl-3 mb-2">
          <Button size={'icon-sm'} variant={'disableLink'} type="button" onClick={() => refetch()}>
            <RotateCw
              className={cn('stroke-destructive stroke-2 size-4', {
                'animate-spin animation-duration-[2.5s]': isError && isFetching
              })}
            />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Label htmlFor="salesChannel" className="text-sm font-medium text-foreground flex items-center gap-2">
        Canal de venta
      </Label>

      <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
        <SelectTrigger id="salesChannel" className="bg-background w-full" disabled={isPending}>
          <SelectValue
            placeholder={isPending ? 'Cargando ...' : 'Seleccionar Catálogo'}
            className={cn({ 'animate-pulse': isPending })}
          />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {!salesChannel || salesChannel.length === 0 ? (
            <span className="text-sm py-1.5 pr-8 pl-2">No se encontraron canales de venta</span>
          ) : (
            salesChannel.map((channel) => {
              return (
                <SelectItem key={channel.id} value={channel.id.toString()}>
                  {channel.channel}
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>

      {errors?.[name]?.message && <FormErrorMessage text={String(errors[name].message)} />}
    </>
  );
};
