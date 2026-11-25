import { useApiMutation } from '@/hooks/common/useApiMutation';
import { queryClient } from '@/lib/tanstack-query/query-client';
import { ordersKeys } from '@/hooks/query/order/orders.keys';
import {
  createBillingAction,
  issueBillingAction,
  updateBillingAction,
  voidBillingAction
} from '@/modules/orders/billing/actions';
import { billingMessages } from '@/modules/orders/billing/constants/billing.messages';
import type {
  CreateBillingRequest,
  CreateBillingResponse,
  IssueBillingRequest,
  IssueBillingResponse,
  UpdateBillingRequest,
  UpdateBillingResponse,
  VoidBillingRequest,
  VoidBillingResponse
} from '@/modules/orders/billing/interfaces/api';

const invalidateOrders = () => queryClient.invalidateQueries({ queryKey: ordersKeys.all });

export const useBillingMutation = () => {
  const createBilling = useApiMutation<CreateBillingResponse, CreateBillingRequest>({
    mutationFn: createBillingAction,
    successMessage: billingMessages.BILLING_CREATED,
    onSuccess: invalidateOrders
  });

  const updateBilling = useApiMutation<UpdateBillingResponse, UpdateBillingRequest>({
    mutationFn: updateBillingAction,
    successMessage: billingMessages.BILLING_UPDATED,
    onSuccess: invalidateOrders
  });

  const issueBilling = useApiMutation<IssueBillingResponse, IssueBillingRequest>({
    mutationFn: issueBillingAction,
    successMessage: billingMessages.BILLING_ISSUED,
    onSuccess: invalidateOrders
  });

  const voidBilling = useApiMutation<VoidBillingResponse, VoidBillingRequest>({
    mutationFn: voidBillingAction,
    successMessage: billingMessages.BILLING_VOIDED,
    onSuccess: invalidateOrders
  });

  return { createBilling, updateBilling, issueBilling, voidBilling };
};
