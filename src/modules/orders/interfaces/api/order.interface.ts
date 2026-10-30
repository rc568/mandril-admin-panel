export type DocumentType = 'SIN DOCUMENTO' | 'CARNE DE EXTRANJERIA' | 'PASAPORTE' | 'DNI' | 'RUC' | 'OTRO';
type ClientDocumentType = 'CARNE DE EXTRANJERIA' | 'PASAPORTE' | 'DNI' | 'OTRO';

export type BillingStatus = 'PENDING' | 'ISSUED' | 'VOIDED';

export type InvoiceType = 'FACTURA' | 'BOLETA' | 'SIN COMPROBANTE';
export type OrderStatus = 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';
type OrderType = 'SALE' | 'EXCHANGE' | 'RETURN';
type OrderProductType = 'SALE' | 'RETURN';
type ReturnCondition = 'AVAILABLE' | 'QUARANTINE' | 'DEFECTIVE';

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

interface BillingResponse {
  id: string;
  code: string;
  amount: string;
  status: BillingStatus;
  createdAt: string;
  createdBy: string;
  billingName: string;
  billingReceiptType: 'FACTURA' | 'BOLETA';
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
  billing: BillingResponse[];
}
