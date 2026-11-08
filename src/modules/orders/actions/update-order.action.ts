import { updateOrder } from '../api/orders.api';
import type { UpdateOrderRequest } from '../interfaces/api';

export const updateOrderAction = async ({ id, body }: UpdateOrderRequest) => updateOrder(id, body);
