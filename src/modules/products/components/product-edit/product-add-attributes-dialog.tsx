import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/get-all-attributes.interface';
import { useProductEditContext } from '../../hooks/use-product-edit-context';
import { ProductAddAttributesDialogUI } from '../common/product-add-attributes-dialog-ui';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attributes: GetAttributesApiResponse;
}

export const ProductAddAttributesDialog = ({ open, onOpenChange, attributes }: Props) => {
  const { checkedAttributeId, clearAttributes, selectedAttributesId, defaultAttributesId } = useProductEditContext();

  return (
    <ProductAddAttributesDialogUI
      open={open}
      onOpenChange={onOpenChange}
      attributes={attributes}
      onChecked={checkedAttributeId}
      onClear={clearAttributes}
      selectedIds={selectedAttributesId}
      defaultIds={defaultAttributesId}
    />
  );
};
