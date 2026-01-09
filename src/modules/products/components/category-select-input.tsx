import { FormErrorMessage } from '@/components/common/form-error-message';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/query';
import { cn } from '@/lib/utils';
import { RotateCw } from 'lucide-react';
import { useController, type Control, type FieldErrors, type FieldValues, type Path } from 'react-hook-form';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  errors?: FieldErrors<T>;
}

export const CategorySelectInput = <T extends FieldValues>({ control, name, errors }: Props<T>) => {
  const { data: categories, isError, isPending, isFetching, refetch } = useCategories();
  const { field } = useController({ name: name, control: control });

  if (isError) {
    return (
      <div className="space-y-2">
        <span className="text-sm font-medium text-foreground flex items-center gap-2">Categoría</span>
        <div className="flex justify-between items-center border-destructive/35 border h-8 pl-3 mb-2">
          <span className="text-destructive/85 text-sm">Error al cargar categorías.</span>
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
      <Label htmlFor="category" className="text-sm font-medium text-foreground flex items-center gap-2">
        Categoría
      </Label>

      <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
        <SelectTrigger id="category" className="bg-background w-full" disabled={isPending}>
          <SelectValue
            placeholder={isPending ? 'Cargando ...' : 'Seleccionar Categoría'}
            className={cn({ 'animate-pulse': isPending })}
          />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {!categories || categories.length === 0 ? (
            <span className="text-sm py-1.5 pr-8 pl-2">No se encontraron categorías</span>
          ) : (
            categories.map((cat) => {
              return (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>

      {errors?.[name]?.message && <FormErrorMessage text={String(errors[name]?.message)} />}
    </>
  );
};
