import type { GetOrdersQueryParams } from '../interfaces/api';
import type { GetOrdersFilters } from '../interfaces/ui';

export const orderFiltersToApiQuery = (filters: GetOrdersFilters): GetOrdersQueryParams => ({
  ...filters,
  minDate: filters.startDate,
  maxDate: filters.endDate
});
