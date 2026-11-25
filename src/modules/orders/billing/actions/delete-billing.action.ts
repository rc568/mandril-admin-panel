import { deleteBilling } from '../api/billing.api';
import type { DeleteBillingRequest } from '../interfaces/api';

export const deleteBillingAction = (request: DeleteBillingRequest) => deleteBilling(request);
