import { cancelOrder } from '../api/orders.api';

export const cancelOrderAction = async (id: string) => cancelOrder(id);
