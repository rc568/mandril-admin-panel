import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { RotateCw } from 'lucide-react';
import { useId } from 'react';
import { FormErrorMessage } from '../form-error-message';

interface Option {
  id: number | string;
  label: string;
}

interface Props {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  options?: Option[];
  isPending: boolean;
  isError: boolean;
  isFetching: boolean;
  onRetry: () => void;
  id?: string;
}

export const AsyncSelectField = ({
  label,
  value,
  onChange,
  error,
  options,
  isPending,
  isError,
  isFetching,
  onRetry,
  id: customId
}: Props) => {
  const generatedId = useId();
  const id = customId || generatedId;

  if (isError) {
    return (
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground flex items-center gap-2">{label}</span>
        <div className="flex justify-between items-center border-destructive/35 border h-8 pl-3 mb-2">
          <span className="text-destructive/85 text-sm">Error al cargar las opciones</span>
          <Button size={'icon-sm'} variant={'disableLink'} type="button" onClick={() => onRetry()}>
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
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-foreground flex items-center gap-2">
        {label}
      </Label>

      <Select value={value ?? ''} onValueChange={(v) => onChange(v)}>
        <SelectTrigger id={id} className="bg-background w-full" disabled={isPending}>
          <SelectValue
            placeholder={isPending ? 'Cargando ...' : 'Selecciona una opción'}
            className={cn({ 'animate-pulse': isPending })}
          />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {!options || options.length === 0 ? (
            <span className="text-sm py-1.5 pr-8 pl-2">No se encontraron opciones</span>
          ) : (
            options.map((option) => {
              return (
                <SelectItem key={option.id} value={option.id.toString()}>
                  {option.label}
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>

      {error && <FormErrorMessage text={error} />}
    </div>
  );
};
