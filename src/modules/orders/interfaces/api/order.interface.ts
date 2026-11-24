import type { BillingReceiptType, BillingStatus } from '../../billing/interfaces/api';

export type DocumentType = 'SIN DOCUMENTO' | 'CARNE DE EXTRANJERIA' | 'PASAPORTE' | 'DNI' | 'RUC' | 'OTRO';
export type ClientDocumentType = 'CARNE DE EXTRANJERIA' | 'PASAPORTE' | 'DNI' | 'OTRO';
export type OrderStatus = 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';
export type OrderType = 'SALE' | 'EXCHANGE' | 'RETURN';
export type OrderProductType = 'SALE' | 'RETURN';
export type ReturnCondition = 'AVAILABLE' | 'QUARANTINE' | 'DEFECTIVE';

interface VariantAttribute {
  value: string;
  valueId: number;
  attribute: string;
  attributeId: number;
}

interface OrderClientResponse {
  id: string;
  email: string | null;
  contactName: string | null;
  phoneNumber1: string | null;
  documentNumber: string | null;
  documentNumberType: ClientDocumentType | null;
}

export interface OrderProductResponse {
  id: string;
  code: string;
  name: string;
  type: OrderProductType;
  price: string;
  purchasePrice: string;
  quantity: number;
  variantId: number;
  variantAttributes: VariantAttribute[];
  returnConditions: {
    condition: ReturnCondition;
    quantity: number;
  }[];
}

interface OrderBillingResponse {
  id: string;
  code: string;
  amount: string;
  status: BillingStatus;
  createdAt: string;
  createdBy: string;
  billingName: string;
  billingReceiptType: BillingReceiptType;
  billingDocumentNumberType: DocumentType;
  billingDocumentNumber: string | null;
}

export interface Order {
  id: string;
  type: OrderType;
  status: OrderStatus;
  relatedOrderId: string | null;
  observation: string | null;
  totalSale: string;
  totalCost: string;
  numProducts: number;
  createdAt: string;
  createdBy: string;
  client: OrderClientResponse;
  channel: string;
  products: OrderProductResponse[];
  billing: OrderBillingResponse[];
}
