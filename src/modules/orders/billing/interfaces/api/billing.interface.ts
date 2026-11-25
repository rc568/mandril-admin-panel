import type { IdentityDocumentType } from '@/constants/interfaces/document.interface';

export type InvoiceType = 'FACTURA' | 'BOLETA' | 'SIN COMPROBANTE';
export type BillingStatus = 'PENDING' | 'ISSUED' | 'VOIDED';
export type BillingReceiptType = Exclude<InvoiceType, 'SIN COMPROBANTE'>;

export type BillingMutationResponse = {
  id: string;
  code: string | null;
  amount: string;
  status: BillingStatus;
  billingName: string;
  billingReceiptType: BillingReceiptType;
  billingDocumentNumberType: IdentityDocumentType;
  billingDocumentNumber: string | null;
};
