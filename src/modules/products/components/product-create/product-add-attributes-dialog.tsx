import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/api';
import { useProductCreateContext } from '../../hooks/use-product-create-context';
import { ProductAddAttributesDialogUI } from '../common/product-add-attributes-dialog-ui';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attributes: GetAttributesApiResponse;
}

export const ProductAddAttributesDialog = ({ open, onOpenChange, attributes }: Props) => {
  const { checkedAttributeId, clearAttributes, selectedAttributesId } = useProductCreateContext();

  return (
    <ProductAddAttributesDialogUI
      open={open}
      onOpenChange={onOpenChange}
      attributes={attributes}
      onChecked={checkedAttributeId}
      onClear={clearAttributes}
      selectedIds={selectedAttributesId}
    />
  );
};
