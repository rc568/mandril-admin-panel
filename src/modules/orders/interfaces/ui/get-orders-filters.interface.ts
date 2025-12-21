export interface GetOrdersFilters {
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
