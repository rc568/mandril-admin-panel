import type { Order } from './order.interface';

interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ApiPayload {
  pagination: Pagination;
  orders: Order[];
}

export interface GetOrdersApiResponse {
  data: ApiPayload;
}
