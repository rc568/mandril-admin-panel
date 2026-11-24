import type { BillingReceiptType } from '@/modules/orders/billing/interfaces/api';
import type { ClientDocumentType, DocumentType } from '@/modules/orders/interfaces/api/order.interface';

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
  billingDocumentNumberType: DocumentType;
  billingDocumentNumber: string | null;
}
