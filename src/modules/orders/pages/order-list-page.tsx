import { Title } from '@/components/common/title';
import { useQuery } from '@tanstack/react-query';
import { getOrdersByPage } from '../actions/get-orders-by-page.actions';
import { OrderListSection } from '../components/order-list-section/order-list-section';
import { OrdersStats } from '../components/orders-stats';
import { useOrderParams } from '../hooks/useOrderParams';

export const OrderListPage = () => {
  const { filters, setLimit, setPage, setSearch, setFilters, setSortBy } = useOrderParams();

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['orders', filters],
    queryFn: () => getOrdersByPage(filters),
    staleTime: 1000 * 60 * 5
  });

  if (isLoading) return <h1>Cargando página ...</h1>;

  return (
    <>
      <Title title="Ventas" subtitle="Ventas realizadas" />

      {isFetching || !data ? (
        <h1>Cargando datos ...</h1>
      ) : (
        <>
          <OrdersStats />

          <OrderListSection
            orders={data.orders}
            pagination={data.pagination}
            filters={filters}
            setSearch={setSearch}
            setFilters={setFilters}
            setSortBy={setSortBy}
            setLimit={setLimit}
            setPage={setPage}
          />
        </>
      )}
    </>
  );
};
