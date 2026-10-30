import type { GetOrdersApiResponse, Order, OrderProductResponse } from '../api';

interface OrderProductMapped extends OrderProductResponse {
  subTotal: string;
}

export interface OrderMapped extends Order {
  products: OrderProductMapped[];
}

export interface GetOrdersMapped extends GetOrdersApiResponse {
  orders: OrderMapped[];
}
