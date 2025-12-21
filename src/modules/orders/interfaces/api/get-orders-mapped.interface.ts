import type { GetOrdersApiResponse } from './get-orders.interface';
import type { Order, OrderProduct } from './order.interface';

export interface OrderProductMapped extends OrderProduct {
  subTotal: string;
}

export interface OrderMapped extends Order {
  products: OrderProductMapped[];
}

export interface GetOrdersMapped extends GetOrdersApiResponse {
  orders: OrderMapped[];
}
