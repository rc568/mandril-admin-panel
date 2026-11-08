import type { Order, ReturnCondition } from './order.interface';

export interface CompleteOrderItemInput {
  orderProductId: string;
  condition: ReturnCondition;
  quantity: number;
}

export interface CompleteOrderPayload {
  items?: [CompleteOrderItemInput, ...CompleteOrderItemInput[]];
}

interface OrderIdParams {
  id: string;
}
export interface CompleteOrderRequest extends OrderIdParams {
  body?: CompleteOrderPayload;
}

export type CompleteOrderResponse = Order;
