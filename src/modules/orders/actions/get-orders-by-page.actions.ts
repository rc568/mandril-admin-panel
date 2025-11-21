import { ordersApi } from '../api/orders.api';
import type { GetOrdersMapped } from '../interfaces/get-orders-mapped.interface';
import type { GetOrdersApiResponse } from '../interfaces/get-orders.interface';
import { mapOrderToDisplay } from '../mappers/get-orders-by-page.mapper';

export const getOrdersByPage = async (page: number = 1, limit: number = 24): Promise<GetOrdersMapped> => {
  const response = await ordersApi.get<GetOrdersApiResponse>('/', {
    params: {
      page: page,
      limit: limit
    }
  });
  const { pagination, orders } = response.data.data;

  return {
    pagination,
    orders: orders.map(mapOrderToDisplay)
  };
};
