import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, type Control } from 'react-hook-form';
import { useAttributeValuesQuery } from '../../hooks/use-attribute-values-query';

interface Props {
  attributeId: number;
  attributeIndex: number;
  attributeName?: string;
  control: Control<any>;
  variantIndex: number;
}

export const VariantAttributeField = ({ attributeId, attributeIndex, attributeName, variantIndex, control }: Props) => {
  const { data: attributeValues, isLoading, isError } = useAttributeValuesQuery(attributeId);

  const label = `variant-${variantIndex + 1}-attribute-value-${attributeId}`;

  return (
    <div className="flex gap-2">
      <Label id={label} className="text-sm font-medium text-foreground capitalize">
        {attributeName}:
      </Label>

      {isLoading && <div className="flex-1 text-sm text-muted-foreground">Cargando valores...</div>}

      {isError && <div className="flex-1 text-sm text-destructive">Error al cargar valores</div>}

      {!isLoading && !isError && attributeValues && (
        <>
          <Controller
            control={control}
            name={`variants.${variantIndex}.attributes.${attributeIndex}.valueId`}
            render={({ field }) => (
              <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
                <SelectTrigger aria-labelledby={label} className="bg-background">
                  <SelectValue placeholder="Seleccionar Valor" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {attributeValues.values.map((value) => {
                    return (
                      <SelectItem key={value.id} value={value.id.toString()}>
                        {value.value}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          />

          <Controller
            control={control}
            name={`variants.${variantIndex}.attributes.${attributeIndex}.attributeId`}
            defaultValue={attributeId}
            render={({ field }) => <input type="hidden" {...field} value={attributeId} />}
          />
        </>
      )}
    </div>
  );
};
