import { AsyncSelectField } from '@/components/common/form';
import { capitalizeFirstLetter } from '@/lib/format-string';
import { Controller, useFormContext, type Control } from 'react-hook-form';
import { useAttributeValuesQuery } from '../../hooks/use-attribute-values-query';
import type { EditProductForm } from '../../interfaces/ui';

interface Props {
  attributeId: number;
  attributeIndex: number;
  attributeName?: string;
  control: Control<any>;
  variantIndex: number;
  isDisabled?: boolean;
}

export const VariantAttributeField = ({ attributeId, attributeIndex, attributeName, variantIndex, control }: Props) => {
  const { data: attributeValues, isPending, isFetching, isError, refetch } = useAttributeValuesQuery(attributeId);
  const {
    formState: { defaultValues }
  } = useFormContext<EditProductForm>();

  const defaultAttributeValue = defaultValues?.variants?.[variantIndex]?.attributes?.[attributeIndex]?.valueId;
  const optionsMap = attributeValues?.values.map((v) => ({ id: v.id, label: v.value }));

  return (
    <div>
      <Controller
        control={control}
        name={`variants.${variantIndex}.attributes.${attributeIndex}.valueId`}
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
          name={`variants.${variantIndex}.attributes.${attributeIndex}.attributeId`}
          defaultValue={attributeId}
          render={({ field }) => <input type="hidden" {...field} value={attributeId} />}
        />
      )}
    </div>
  );
};
