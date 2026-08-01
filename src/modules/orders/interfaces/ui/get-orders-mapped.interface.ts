import type { GetOrdersApiResponse, Order, OrderProduct } from '../api';

interface OrderProductMapped extends OrderProduct {
  subTotal: string;
}

export interface OrderMapped extends Order {
  products: OrderProductMapped[];
}

export interface GetOrdersMapped extends GetOrdersApiResponse {
  orders: OrderMapped[];
}
