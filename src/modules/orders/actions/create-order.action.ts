import { createOrder } from '../api/orders.api';
import type { CreateOrderPayload } from '../interfaces/ui/create-order-form.interface';

export const createOrderAction = async (body: CreateOrderPayload) => {
  return await createOrder(body);
};
