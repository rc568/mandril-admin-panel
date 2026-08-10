import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useId } from 'react';
import { FormErrorMessage } from '../form-error-message';

interface Option {
  id: number | string;
  label: string;
}

interface Props {
  label: string;
  value?: string;
  inline?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
  error?: string;
  options?: Option[];
  id?: string;
}

export const SelectField = ({
  label,
  value,
  inline = false,
  disabled = false,
  onChange,
  error,
  options,
  id: customId
}: Props) => {
  const generatedId = useId();
  const id = customId || generatedId;

  return (
    <div className={cn('space-y-2', { 'space-y-0 flex gap-2 items-center w-fit': inline })}>
      <Label htmlFor={id} className={cn('text-sm font-medium text-foreground', { 'shrink-0': inline })}>
        {`${label}${inline ? ':' : ''}`}
      </Label>

      <Select value={value ?? ''} onValueChange={(v) => onChange(v)}>
        <SelectTrigger
          id={id}
          className="bg-background w-full disabled:border-none disabled:shadow-none disabled:opacity-100 disabled:text-muted-foreground disabled:[&_svg]:hidden disabled:cursor-auto"
          disabled={disabled}
        >
          <SelectValue placeholder={'Selecciona una opción'} />
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
