import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/api';
import { useFormContext, useWatch } from 'react-hook-form';
import type { CreateProductForm } from '../../interfaces/ui';
import { ProductGeneralInfoUI } from '../common/product-general-info-ui';

interface Props {
  attributes: GetAttributesApiResponse;
  onAdd: () => void;
}

export const ProductCreateGeneralInfo = ({ attributes, onAdd }: Props) => {
  const form = useFormContext<CreateProductForm>();
  const attributesField = useWatch({ control: form.control, name: `attributesId` });

  return (
    <ProductGeneralInfoUI<CreateProductForm>
      attributes={attributes}
      onAdd={onAdd}
      form={form}
      attributesField={attributesField}
    />
  );
};
