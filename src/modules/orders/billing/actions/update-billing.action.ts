import { updateBilling } from '../api/billing.api';
import type { UpdateBillingRequest } from '../interfaces/api';

export const updateBillingAction = (request: UpdateBillingRequest) => updateBilling(request);
