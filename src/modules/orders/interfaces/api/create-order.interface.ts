import type { ClientDocumentType, Order, OrderStatus } from './order.interface';

type CreateOrderStatus = Extract<OrderStatus, 'PENDING' | 'PAID' | 'COMPLETED'>;

interface CreateOrderProductInput {
  variantId: number;
  type: 'SALE';
  price: number;
  quantity: number;
}

interface CreateOrderClientInput {
  contactName?: string;
  email?: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  documentNumberType?: ClientDocumentType;
  documentNumber?: string;
}

// ONLY SALE ORDER TYPE IMPLEMENTATION
export interface CreateOrderPayload {
  type: 'SALE';
  salesChannelId: number;
  status?: CreateOrderStatus;
  observation?: string;
  products: CreateOrderProductInput[];
  client: CreateOrderClientInput;
}
export type CreateOrderResponse = Order;
