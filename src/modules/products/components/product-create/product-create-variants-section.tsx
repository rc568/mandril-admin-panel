import { useFormContext, useWatch } from 'react-hook-form';
import { useProductCreateContext } from '../../hooks/use-product-create-context';
import type { CreateProductForm } from '../../interfaces/ui';
import { ProductVariantsSectionUI } from '../common/product-variants-section-ui';
import { ProductCreateVariantCard } from './product-create-variant-card';

export const ProductCreateVariantsSection = () => {
  const { control } = useFormContext<CreateProductForm>();
  const {
    variantsFA: { append, remove, fields: variantsField }
  } = useProductCreateContext();
  const attributesFieldWatch = useWatch({ control: control, name: `attributesId` }) ?? [];

  const removeVariant = (index: number) => remove(index);

  return (
    <>
      <ProductVariantsSectionUI
        attributesSelectedCount={attributesFieldWatch.length}
        onAppend={() => append({ price: 0, purchasePrice: 0, quantityInStock: 0, attributes: [] })}
        onRemove={removeVariant}
        variantsField={variantsField}
        VariantCard={ProductCreateVariantCard}
      />
    </>
  );
};
