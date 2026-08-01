import { getOrders } from '../api/orders.api';
import type { GetOrdersFilters, GetOrdersMapped } from '../interfaces/ui';

import { mapOrderToDisplay } from '../mappers/get-orders-by-page.mapper';
import { orderFiltersToApiQuery } from '../mappers/order-filters-to-api-query.mapper';

export const getOrdersByPage = async (filters: GetOrdersFilters): Promise<GetOrdersMapped> => {
  const params = orderFiltersToApiQuery(filters);
  const data = await getOrders(params);
  const { pagination, orders } = data;

  return {
    pagination,
    orders: orders.map(mapOrderToDisplay)
  };
};
