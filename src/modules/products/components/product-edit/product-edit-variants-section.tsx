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
  const { variantsFields, appendVariant, removeVariant } = useProductEditContext();
  const attributesFieldWatch = useWatch({ control: control, name: 'attributesId' }) ?? [];

  return (
    <ProductVariantsSectionUI
      attributes={attributes}
      attributesSelectedCount={attributesFieldWatch.length}
      onAppend={appendVariant}
      onRemove={removeVariant}
      variantsField={variantsFields.map((v) => ({ id: v.id, variantId: v.variantId }))}
      VariantCard={ProductEditVariantCard}
    />
  );
};
