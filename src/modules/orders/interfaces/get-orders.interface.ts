import type { Order } from './order.interface';

interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  nextPage: number | null;
  prevPage: number | null;
}

export interface GetOrdersApiResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface GetOrdersQueryParams {
  page: number;
  limit: number;
  search?: string;
  channel?: string;
  status?: string;
  invoiceType?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
}
