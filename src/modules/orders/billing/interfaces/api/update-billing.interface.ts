import type { IdentityDocumentType } from '@/constants/interfaces/document.interface';
import type { BillingMutationResponse } from './billing.interface';

type UpdateBillingIdentity =
  | {
      billingName: string;
      billingReceiptType: 'FACTURA';
      billingDocumentNumberType: 'RUC';
      billingDocumentNumber: string;
    }
  | {
      billingName: string;
      billingReceiptType: 'BOLETA';
      billingDocumentNumberType: 'SIN DOCUMENTO';
      billingDocumentNumber?: undefined;
    }
  | {
      billingName: string;
      billingReceiptType: 'BOLETA';
      billingDocumentNumberType: Exclude<IdentityDocumentType, 'RUC' | 'SIN DOCUMENTO'>;
      billingDocumentNumber: string;
    };

interface UpdateBillingFields {
  amount?: number;
  billingAddress?: string;
  note?: string;
}

export type UpdateBillingPayload = UpdateBillingFields &
  (
    | UpdateBillingIdentity
    | {
        billingName?: never;
        billingReceiptType?: never;
        billingDocumentNumberType?: never;
        billingDocumentNumber?: never;
      }
  );

export interface UpdateBillingRequest {
  id: string;
  body: UpdateBillingPayload;
}

export type UpdateBillingResponse = BillingMutationResponse;
