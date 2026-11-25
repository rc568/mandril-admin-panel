import type { IdentityDocumentType } from '@/constants/interfaces/document.interface';
import type { BillingMutationResponse, BillingStatus } from './billing.interface';

interface CreateBillingBasePayload {
  amount: number;
  billingName: string;
  billingAddress?: string;
  note?: string;
}

type CreateBillingIdentity =
  | {
      billingReceiptType: 'FACTURA';
      billingDocumentNumberType: 'RUC';
      billingDocumentNumber: string;
    }
  | (
      | {
          billingReceiptType: 'BOLETA';
          billingDocumentNumberType: 'SIN DOCUMENTO';
          billingDocumentNumber?: undefined;
        }
      | {
          billingReceiptType: 'BOLETA';
          billingDocumentNumberType: Exclude<IdentityDocumentType, 'RUC' | 'SIN DOCUMENTO'>;
          billingDocumentNumber: string;
        }
    );

type CreatePendingBillingPayload = CreateBillingBasePayload &
  CreateBillingIdentity & { status: Extract<BillingStatus, 'PENDING'>; code?: undefined };

type CreateIssuedBillingPayload = CreateBillingBasePayload &
  CreateBillingIdentity & { status: Extract<BillingStatus, 'ISSUED'>; code: string };

export type CreateBillingPayload = CreatePendingBillingPayload | CreateIssuedBillingPayload;

export interface CreateBillingRequest {
  orderId: string;
  body: CreateBillingPayload;
}

export type CreateBillingResponse = BillingMutationResponse;
