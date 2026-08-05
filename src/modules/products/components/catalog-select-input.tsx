import { AsyncSelectField } from '@/components/common/form';
import { useCatalogs } from '@/hooks/query';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  error?: string;
}

export const CatalogSelectInput = <T extends FieldValues>({ control, name, error }: Props<T>) => {
  const { data: catalogs, isError, isPending, isFetching, refetch } = useCatalogs();
  const optionsMap = catalogs?.map((c) => ({ id: c.id, label: c.name }));

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <AsyncSelectField
          label="Catálogos"
          value={(field.value ?? '').toString()}
          onChange={(v) => field.onChange(Number(v))}
          error={error}
          options={optionsMap}
          isPending={isPending}
          isError={isError}
          isFetching={isFetching}
          onRetry={refetch}
        />
      )}
    />
  );
};
