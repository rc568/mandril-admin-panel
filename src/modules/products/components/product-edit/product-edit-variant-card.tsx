import { useAttributes } from '@/hooks/query';
import { useFormContext, useWatch } from 'react-hook-form';
import { useProductEditContext } from '../../hooks/use-product-edit-context';
import type { EditProductForm } from '../../interfaces/ui';
import { ProductVariantCardUI } from '../common/product-variant-card-ui';

interface Props {
  index: number;
  variantId?: number;
  onDelete: (index: number) => void;
}

export const ProductEditVariantCard = ({ variantId, index, onDelete }: Props) => {
  const form = useFormContext<EditProductForm>();
  const { variantsCode } = useProductEditContext();
  const { data: attributes } = useAttributes();

  const attributesField = useWatch({ control: form.control, name: 'attributesId' }) ?? [];

  const { price: watchPrice = 0, purchasePrice: watchPurchasePrice = 0 } =
    useWatch({
      control: form.control,
      name: `variants.${index}`
    }) ?? {};

  const variantCode = variantsCode.find((v) => v.variantId === variantId);
  const variantError = form.formState.errors.variants?.[index];

  return (
    <ProductVariantCardUI
      attributes={attributes ?? []}
      attributesField={attributesField}
      form={form}
      variantError={variantError}
      index={index}
      code={variantCode?.code}
      watchPrice={watchPrice}
      watchPurchasePrice={watchPurchasePrice}
      onDelete={onDelete}
    />
  );
};
