import { AsyncSelectField } from '@/components/common/form';
import { capitalizeFirstLetter } from '@/lib/format-string';
import { Controller, type Path, type PathValue, type UseFormReturn } from 'react-hook-form';
import { useAttributeValuesQuery } from '../../hooks/use-attribute-values-query';
import type { BaseVariantFields } from '../../interfaces/ui';

interface Props<T extends BaseVariantFields> {
  form: UseFormReturn<T>;
  attributeId: number;
  attributeIndex: number;
  attributeName?: string;
  variantIndex: number;
}

export const VariantAttributeField = <T extends BaseVariantFields>({
  form,
  attributeId,
  attributeIndex,
  attributeName,
  variantIndex
}: Props<T>) => {
  const { data: attributeValues, isPending, isFetching, isError, refetch } = useAttributeValuesQuery(attributeId);
  const {
    formState: { defaultValues },
    control
  } = form;

  const defaultAttributeValue = defaultValues?.variants?.[variantIndex]?.attributes?.[attributeIndex]?.valueId;
  const optionsMap = attributeValues?.values.map((v) => ({ id: v.id, label: v.value }));

  return (
    <div>
      <Controller
        control={control}
        name={`variants.${variantIndex}.attributes.${attributeIndex}.valueId` as Path<T>}
        render={({ field }) => (
          <AsyncSelectField
            label={capitalizeFirstLetter(attributeName ?? '')}
            value={field.value?.toString()}
            inline={true}
            disabled={isPending || defaultAttributeValue !== undefined}
            onChange={(v) => field.onChange(Number(v))}
            options={optionsMap}
            isPending={isPending}
            isError={isError}
            isFetching={isFetching}
            onRetry={refetch}
          />
        )}
      />

      {optionsMap && optionsMap.length > 0 && (
        <Controller
          control={control}
          name={`variants.${variantIndex}.attributes.${attributeIndex}.attributeId` as Path<T>}
          defaultValue={attributeId as PathValue<T, Path<T>>}
          render={({ field }) => <input type="hidden" {...field} value={attributeId} />}
        />
      )}
    </div>
  );
};
