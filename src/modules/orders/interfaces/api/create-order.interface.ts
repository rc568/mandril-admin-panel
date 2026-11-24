import type { ClientDocumentType } from '@/services/client/interfaces/client.interface';
import type { Order, OrderStatus } from './order.interface';

type CreateOrderStatus = Extract<OrderStatus, 'PENDING' | 'PAID' | 'COMPLETED'>;

interface CreateSaleOrderProductInput {
  variantId: number;
  type: 'SALE';
  price: number;
  quantity: number;
}

interface CreateReturnOrderProductInput {
  variantId: number;
  type: 'RETURN';
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

interface CreateOrderBasePayload {
  salesChannelId: number;
  observation?: string;
}

interface CreateSaleOrderPayload extends CreateOrderBasePayload {
  type: 'SALE';
  status?: CreateOrderStatus;
  relatedOrderId?: undefined;
  fullReturn?: undefined;
  products: CreateSaleOrderProductInput[];
  client: CreateOrderClientInput;
}

interface CreateExchangeOrderPayload extends CreateOrderBasePayload {
  type: 'EXCHANGE';
  status?: 'PENDING';
  relatedOrderId: string;
  fullReturn?: undefined;
  products: (CreateSaleOrderProductInput | CreateReturnOrderProductInput)[];
  client?: undefined;
}

interface CreateFullReturnOrderPayload extends CreateOrderBasePayload {
  type: 'RETURN';
  status?: 'PENDING';
  relatedOrderId: string;
  fullReturn: true;
  products?: undefined;
  client?: undefined;
}

interface CreatePartialReturnOrderPayload extends CreateOrderBasePayload {
  type: 'RETURN';
  status?: 'PENDING';
  relatedOrderId: string;
  fullReturn: false;
  products: CreateReturnOrderProductInput[];
  client?: undefined;
}

export type CreateOrderPayload =
  | CreateSaleOrderPayload
  | CreateExchangeOrderPayload
  | CreateFullReturnOrderPayload
  | CreatePartialReturnOrderPayload;
export type CreateOrderResponse = Order;
