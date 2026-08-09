import { useAttributes } from '@/hooks/query';
import { useFormContext, useWatch } from 'react-hook-form';
import type { CreateProductForm } from '../../interfaces/ui';
import { ProductVariantCardUI } from '../common/product-variant-card-ui';

interface Props {
  index: number;
  onDelete: (index: number) => void;
}

export const ProductCreateVariantCard = ({ index, onDelete }: Props) => {
  const form = useFormContext<CreateProductForm>();
  const { data: attributes } = useAttributes();

  const attributesField = useWatch({ control: form.control, name: `attributesId` }) ?? [];

  const { price: watchPrice, purchasePrice: watchPurchasePrice } = useWatch({
    control: form.control,
    name: `variants.${index}`
  });

  const variantError = form.formState.errors.variants?.[index];

  return (
    <ProductVariantCardUI
      attributes={attributes ?? []}
      attributesField={attributesField}
      form={form}
      index={index}
      variantError={variantError}
      watchPrice={watchPrice}
      watchPurchasePrice={watchPurchasePrice}
      onDelete={onDelete}
    />
  );
};
