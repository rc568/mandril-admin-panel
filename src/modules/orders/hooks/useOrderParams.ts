import { useSearchParams } from 'react-router';
import { INVOICE_TYPE, ORDER_STATUS } from '../constants/order.constants';
import type { GetOrdersQueryParams } from '../interfaces/get-orders.interface';

interface UseTableFiltersConfig {
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
}

export const useOrderParams = (config: UseTableFiltersConfig = {}) => {
  const { defaultPage = 1, defaultLimit = 24, maxLimit = 96 } = config;

  const [searchParams, setSearchParams] = useSearchParams();

  const queryPage = searchParams.get('page') ?? defaultPage.toString();
  const queryLimit = searchParams.get('limit') ?? defaultLimit.toString();
  const querySearch = searchParams.get('search');
  const queryChannel = searchParams.get('channel');
  const queryStatus = searchParams.get('status');
  const queryInvoiceType = searchParams.get('invoiceType');
  const queryStartDate = searchParams.get('startDate');
  const queryEndDate = searchParams.get('endDate');

  const page = Number.isNaN(parseInt(queryPage)) || parseInt(queryPage) <= 0 ? defaultPage : parseInt(queryPage);
  const limit =
    Number.isNaN(parseInt(queryLimit)) || parseInt(queryLimit) > maxLimit || parseInt(queryLimit) <= 0
      ? defaultLimit
      : parseInt(queryLimit);

  const search = querySearch && querySearch.trim().length !== 0 ? querySearch : undefined;
  const channel = queryChannel && !Number.isNaN(Number(queryChannel)) ? queryChannel : undefined;
  const status = queryStatus && ORDER_STATUS.includes(queryStatus) ? queryStatus : undefined;
  const invoiceType = queryInvoiceType && INVOICE_TYPE.includes(queryInvoiceType) ? queryInvoiceType : undefined;
  const startDate = queryStartDate ? new Date(queryStartDate) : undefined;
  const endDate = queryEndDate ? new Date(queryEndDate) : undefined;

  const filters: GetOrdersQueryParams = {
    limit,
    page,
    search,
    channel,
    status,
    invoiceType,
    startDate,
    endDate
  };

  const setPage = (page: number) => {
    setSearchParams((prev) => {
      prev.set('page', page.toString());
      return prev;
    });
  };

  const setLimit = (limit: string) => {
    setSearchParams((prev) => {
      prev.set('limit', limit);
      prev.delete('page');
      return prev;
    });
  };

  const setSearch = (search: string) => {
    if (search.trim().length === 0) return;
    setSearchParams(() => {
      const searchParams = new URLSearchParams({ search: search.trim().toLowerCase() });
      if (limit) searchParams.set('limit', limit.toString());
      return searchParams;
    });
  };

  const setFilters = (newFilters: Partial<GetOrdersQueryParams>) => {
    setSearchParams((prev) => {
      const newFiltersEntries = Object.entries(newFilters);

      if (newFiltersEntries.length === 0) {
        const searchParams = new URLSearchParams();
        if (limit) searchParams.set('limit', limit.toString());
        return searchParams;
      }

      if (
        (!newFilters.status || newFilters.status === filters.status) &&
        (!newFilters.startDate || newFilters.startDate === filters.startDate) &&
        (!newFilters.endDate || newFilters.endDate === filters.endDate) &&
        (!newFilters.channel || newFilters.channel === filters.channel) &&
        (!newFilters.invoiceType || newFilters.invoiceType === filters.invoiceType)
      ) {
        return prev;
      }

      prev.delete('page');

      newFiltersEntries.forEach(([key, value]) => {
        if (!value) {
          prev.delete(key);
          return;
        }

        if (key === 'startDate' || key === 'endDate') {
          prev.set(key, (value as Date).toISOString());
          return;
        }

        prev.set(key, value.toString());
      });

      return prev;
    });
  };

  return {
    filters,
    setPage,
    setLimit,
    setSearch,
    setFilters
  };
};
