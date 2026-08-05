import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/api';
import { useFormContext, useWatch } from 'react-hook-form';
import type { CreateProductForm } from '../../interfaces/ui';
import { ProductVariantCardUI } from '../common/product-variant-card-ui';

interface Props {
  attributes: GetAttributesApiResponse;
  index: number;
  id: string;
  onDelete: (index: number) => void;
}

export const ProductCreateVariantCard = ({ attributes, id, index, onDelete }: Props) => {
  const form = useFormContext<CreateProductForm>();

  const attributesField = useWatch({ control: form.control, name: `attributesId` }) ?? [];

  const { price: watchPrice, purchasePrice: watchPurchasePrice } = useWatch({
    control: form.control,
    name: `variants.${index}`
  });

  const variantError = form.formState.errors.variants?.[index];

  return (
    <ProductVariantCardUI
      attributes={attributes}
      attributesField={attributesField}
      form={form}
      index={index}
      variantError={variantError}
      id={id}
      watchPrice={watchPrice}
      watchPurchasePrice={watchPurchasePrice}
      onDelete={onDelete}
    />
  );
};
