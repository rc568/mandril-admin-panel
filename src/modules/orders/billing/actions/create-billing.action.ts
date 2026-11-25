import { createBilling } from '../api/billing.api';
import type { CreateBillingRequest } from '../interfaces/api';

export const createBillingAction = (request: CreateBillingRequest) => createBilling(request);
