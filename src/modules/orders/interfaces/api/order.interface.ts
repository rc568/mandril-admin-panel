export type DocumentType = 'SIN DOCUMENTO' | 'CARNE DE EXTRANJERIA' | 'PASAPORTE' | 'DNI' | 'RUC' | 'OTRO';
export type InvoiceType = 'FACTURA' | 'BOLETA' | 'SIN COMPROBANTE';
export type OrderStatus = 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';

export interface Client {
  id: string;
  email: string | null;
  contactName: string | null;
  documentType: DocumentType;
  phoneNumber1: string | null;
  bussinessName: string | null;
  documentNumber: string | null;
}

export interface Product {
  code: string;
  name: string;
  price: string;
  quantity: number;
  variantId: number;
  attribute: string;
  attributeValue: string;
}

export interface Order {
  id: string;
  invoiceType: InvoiceType;
  invoiceCode: string | null;
  status: OrderStatus;
  observation: string | null;
  totalSale: string;
  numProducts: number;
  createdAt: string;
  createdBy: string;
  client: Client;
  channel: string;
  products: Product[];
}
