import type { ClientDocumentType, Order, OrderProductType, OrderStatus } from './order.interface';

// Order updates only support SALE lines, RETURN lines are rejected by the service.
interface UpdateOrderProductInput {
  variantId: number;
  type: Extract<OrderProductType, 'SALE'>;
  price: number;
  quantity: number;
}

interface UpdateOrderClientInput {
  contactName?: string;
  email?: string;
  phoneNumber1?: string;
  phoneNumber2?: string;
  documentNumberType?: ClientDocumentType;
  documentNumber?: string;
}

export interface UpdateOrderPayload {
  salesChannelId?: number;
  status?: Extract<OrderStatus, 'PENDING' | 'PAID'>;
  observation?: string;
  products?: [UpdateOrderProductInput, ...UpdateOrderProductInput[]];
  client?: UpdateOrderClientInput;
}

interface OrderIdParams {
  id: string;
}

export interface UpdateOrderRequest extends OrderIdParams {
  body: UpdateOrderPayload;
}
export type UpdateOrderResponse = Order;
