import type { GetOrdersQueryParams } from '../interfaces/api/get-orders.interface';
import type { GetOrdersFilters } from '../interfaces/ui/get-orders-filters.interface';

export const orderFiltersToApiQuery = (filters: GetOrdersFilters): GetOrdersQueryParams => ({
  page: filters.page,
  limit: filters.limit,
  search: filters.search,
  channel: filters.channel,
  status: filters.status,
  invoiceType: filters.invoiceType,
  minDate: filters.startDate,
  maxDate: filters.endDate,
  sortBy: filters.sortBy
});
