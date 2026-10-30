export interface GetOrdersFilters {
  page: number;
  limit: number;
  search?: string;
  channel?: string;
  status?: string;
  billingStatus?: string;
  receiptType?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
}
