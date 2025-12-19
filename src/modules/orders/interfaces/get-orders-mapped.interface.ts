import type { ApiPayload } from './get-orders.interface';
import type { Order, Product } from './order.interface';

export interface ProductMapped extends Product {
  subTotal: string;
}

export interface OrderMapped extends Order {
  products: ProductMapped[];
}

export interface GetOrdersMapped extends ApiPayload {
  orders: OrderMapped[];
}
