import { voidBilling } from '../api/billing.api';
import type { VoidBillingRequest } from '../interfaces/api';

export const voidBillingAction = (request: VoidBillingRequest) => voidBilling(request);
