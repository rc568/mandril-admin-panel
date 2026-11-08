import { createOrder } from '../api/orders.api';
import type { CreateOrderPayload } from '../interfaces/api';

export const createOrderAction = async (body: CreateOrderPayload) => {
  return await createOrder(body);
};
