import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/get-all-attributes.interface';
import { useFormContext, useWatch } from 'react-hook-form';
import { useProductEditContext } from '../../hooks/use-product-edit-context';
import type { EditProductForm } from '../../interfaces/ui/create-product-form.interface';
import { ProductVariantsSectionUI } from '../common/product-variants-section-ui';
import { ProductEditVariantCard } from './product-edit-variant-card';

interface Props {
  attributes: GetAttributesApiResponse;
}

export const ProductEditVariantsSection = ({ attributes }: Props) => {
  const { control } = useFormContext<EditProductForm>();
  const {
    variantsFA: { append: _append, remove, fields: variantsField }
  } = useProductEditContext();
  const attributesFieldWatch = useWatch({ control: control, name: 'attributesId' }) ?? [];

  const removeVariant = (index: number) => remove(index);

  return (
    <ProductVariantsSectionUI
      attributes={attributes}
      attributesSelectedCount={attributesFieldWatch.length}
      // onAppend={() => append({ price: 0, purchasePrice: 0, quantityInStock: 0, attributes: [] })}
      onAppend={() => {}}
      onRemove={removeVariant}
      variantsField={variantsField.map((v) => ({ id: v.id, variantId: v.variantId }))}
      VariantCard={ProductEditVariantCard}
    />
  );
};
