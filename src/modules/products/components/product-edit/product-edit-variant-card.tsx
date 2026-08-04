import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/api';
import { useFormContext, useWatch } from 'react-hook-form';
import { useProductEditContext } from '../../hooks/use-product-edit-context';
import type { EditProductForm } from '../../interfaces/ui';
import { ProductVariantCardUI } from '../common/product-variant-card-ui';

interface Props {
  attributes: GetAttributesApiResponse;
  index: number;
  id: string;
  variantId?: number;
  onDelete: (index: number) => void;
}

export const ProductEditVariantCard = ({ attributes, id, variantId, index, onDelete }: Props) => {
  const form = useFormContext<EditProductForm>();
  const { variantsCode } = useProductEditContext();

  const attributesField = useWatch({ control: form.control, name: 'attributesId' }) ?? [];

  const { price: watchPrice = 0, purchasePrice: watchPurchasePrice = 0 } =
    useWatch({
      control: form.control,
      name: `variants.${index}`
    }) ?? {};

  const variantCode = variantsCode.find((v) => v.variantId === variantId);

  return (
    <ProductVariantCardUI
      attributes={attributes}
      attributesField={attributesField}
      form={form}
      index={index}
      id={id}
      code={variantCode?.code}
      watchPrice={watchPrice}
      watchPurchasePrice={watchPurchasePrice}
      onDelete={onDelete}
    />
  );
};
