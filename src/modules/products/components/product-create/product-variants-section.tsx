import { Button } from '@/components/ui/button';
import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/get-all-attributes.interface';
import { Plus } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useProductCreateContext } from '../../hooks/use-product-create-context';
import type { CreateProductForm } from '../../interfaces/ui/create-product-form.interface';
import { ProductVariantCard } from './product-variant-card';

interface Props {
  attributes: GetAttributesApiResponse;
}

export const ProductVariantsSection = ({ attributes }: Props) => {
  const { control } = useFormContext<CreateProductForm>();
  const {
    variantsFA: { append, remove, fields: variantsField }
  } = useProductCreateContext();
  const attributesFieldWatch = useWatch({ control: control, name: `attributesId` }) ?? [];

  const removeVariant = (index: number) => remove(index);

  return (
    <>
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Variantes del producto</h2>
        <Button
          type="button"
          disabled={attributesFieldWatch.length <= 0}
          onClick={() => {
            append({ price: 0, purchasePrice: 0, quantityInStock: 0, attributes: [] });
          }}
        >
          <Plus />
          Agregar Variante
        </Button>
      </div>

      {variantsField.map((variant, index) => (
        <ProductVariantCard
          key={variant.id}
          index={index}
          variantId={variant.id}
          attributes={attributes}
          onDelete={removeVariant}
        />
      ))}
    </>
  );
};
