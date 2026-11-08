import { completeOrder } from '../api/orders.api';
import type { CompleteOrderRequest } from '../interfaces/api';

export const completeOrderAction = async ({ id, body }: CompleteOrderRequest) => completeOrder(id, body);
