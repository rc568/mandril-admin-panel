import { AsyncSelectField } from '@/components/common/form/async-select-field';
import { useCategories } from '@/hooks/query';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  error?: string;
}

export const CategorySelectInput = <T extends FieldValues>({ control, name, error }: Props<T>) => {
  const { data: categories, isError, isPending, isFetching, refetch } = useCategories();
  const optionsMap = categories?.map((c) => ({ id: c.id, label: c.name }));

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <AsyncSelectField
          label="Categoría"
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
