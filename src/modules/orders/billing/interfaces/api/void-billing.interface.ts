import type { BillingMutationResponse } from './billing.interface';

export interface VoidBillingRequest {
  id: string;
}

export type VoidBillingResponse = BillingMutationResponse;
