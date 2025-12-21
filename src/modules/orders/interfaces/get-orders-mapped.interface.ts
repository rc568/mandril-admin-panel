import type { GetOrdersApiResponse } from './get-orders.interface';
import type { Order, Product } from './order.interface';

export interface ProductMapped extends Product {
  subTotal: string;
}

export interface OrderMapped extends Order {
  products: ProductMapped[];
}

export interface GetOrdersMapped extends GetOrdersApiResponse {
  orders: OrderMapped[];
}
