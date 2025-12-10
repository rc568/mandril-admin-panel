import { ordersApi } from '../api/orders.api';
import type { GetOrdersMapped } from '../interfaces/get-orders-mapped.interface';
import type { GetOrdersApiResponse, GetOrdersQueryParams } from '../interfaces/get-orders.interface';
import { mapOrderToDisplay } from '../mappers/get-orders-by-page.mapper';

export const getOrdersByPage = async ({
  page,
  limit,
  startDate,
  endDate,
  search,
  channel,
  status,
  invoiceType,
  sortBy
}: GetOrdersQueryParams): Promise<GetOrdersMapped> => {
  const params: Record<string, string | number | Date> = {
    page: page,
    limit: limit
  };

  if (startDate) params.minDate = startDate;
  if (endDate) params.maxDate = endDate;
  if (search) params.search = search;
  if (channel) params.channel = channel;
  if (status) params.status = status;
  if (invoiceType) params.invoiceType = invoiceType;
  if (sortBy) params.sortBy = sortBy;

  const response = await ordersApi.get<GetOrdersApiResponse>('/', {
    params: params
  });
  const { pagination, orders } = response.data.data;

  return {
    pagination,
    orders: orders.map(mapOrderToDisplay)
  };
};
