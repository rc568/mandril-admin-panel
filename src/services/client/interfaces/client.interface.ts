import type { IdentityDocumentType } from '@/constants/interfaces/document.interface';
import type { BillingReceiptType } from '@/modules/orders/billing/interfaces/api';

export type ClientDocumentType = Exclude<IdentityDocumentType, 'SIN DOCUMENTO' | 'RUC'>;

export interface SearchClient {
  clientId: string;
  documentNumberType: ClientDocumentType | null;
  documentNumber: string | null;
  contactName: string | null;
  email: string | null;
  phoneNumber1: string | null;
  phoneNumber2: string | null;
  billingName: string;
  billingReceiptType: BillingReceiptType;
  billingDocumentNumberType: IdentityDocumentType;
  billingDocumentNumber: string | null;
}
