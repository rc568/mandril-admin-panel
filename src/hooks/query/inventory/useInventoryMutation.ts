import { useApiMutation } from '@/hooks/common/useApiMutation';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { productKeys } from '@/hooks/query/product/products.keys';
import { adjustInventoryAction } from '@/modules/inventory/actions';
import { messages } from '@/modules/inventory/constants/inventory.messages';
import type { AdjustInventoryPayload, AdjustInventoryResponse } from '@/modules/inventory/interfaces/api';

export const useInventoryMutation = () => {
  const adjustInventory = useApiMutation<AdjustInventoryResponse, AdjustInventoryPayload>({
    mutationFn: adjustInventoryAction,
    successMessage: messages.INVENTORY_ADJUSTED,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all })
  });

  return { adjustInventory };
};
