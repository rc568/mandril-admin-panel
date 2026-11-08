import { getOrderById } from '../api/orders.api';

export const getOrderByIdAction = async (id: string) => getOrderById(id);
