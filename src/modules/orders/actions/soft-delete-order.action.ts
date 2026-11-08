import { deleteOrder } from '../api/orders.api';

export const softDeleteOrderAction = async (id: string) => deleteOrder(id);
