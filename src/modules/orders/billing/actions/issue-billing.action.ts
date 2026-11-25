import { issueBilling } from '../api/billing.api';
import type { IssueBillingRequest } from '../interfaces/api';

export const issueBillingAction = (request: IssueBillingRequest) => issueBilling(request);
