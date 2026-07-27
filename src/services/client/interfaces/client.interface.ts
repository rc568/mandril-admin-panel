import type { DocumentType } from '@/modules/orders/interfaces/api/order.interface';

export interface SearchClient {
  clientId: string;
  documentType: DocumentType;
  documentNumber: string;
  bussinessName: string;
  contactName: string | null;
  email: string | null;
  phoneNumber1: string | null;
  phoneNumber2: string | null;
}
