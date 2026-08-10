import { AsyncSelectField } from '@/components/common/form';
import { useSalesChannel } from '@/hooks/query/sales-channel';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';

interface Props<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  error?: string;
}

export const SalesChannelSelectInput = <T extends FieldValues>({ control, name, error }: Props<T>) => {
  const { data: salesChannel, isError, isPending, isFetching, refetch } = useSalesChannel();
  const optionsMap = salesChannel?.map((sc) => ({ id: sc.id, label: sc.channel }));

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <AsyncSelectField
          label="Canal de Venta"
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
