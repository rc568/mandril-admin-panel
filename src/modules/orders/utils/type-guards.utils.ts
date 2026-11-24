import { ORDER_STATUS } from '../constants/order.constants';
import type { OrderStatus } from '../interfaces/api';

export const isOrderStatus = (value: string): value is OrderStatus => {
  return (ORDER_STATUS as string[]).includes(value);
};
