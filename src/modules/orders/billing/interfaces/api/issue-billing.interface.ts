import type { BillingMutationResponse } from './billing.interface';

export interface IssueBillingRequest {
  id: string;
  body: { code: string };
}

export type IssueBillingResponse = BillingMutationResponse;
