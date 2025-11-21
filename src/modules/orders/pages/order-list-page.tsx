import { CustomPagination } from '@/components/common/custom-pagination';
import { Title } from '@/components/common/title';
import { ProductPerPageOptions } from '@/modules/products/components/product-per-page-options';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import { getOrdersByPage } from '../actions/get-orders-by-page.actions';
import { OrderList } from '../components/order-list';
import { OrdersStats } from '../components/orders-stats';

export const OrderListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryPage = searchParams.get('page') ?? '1';
  const queryLimit = searchParams.get('limit') ?? '24';

  const page = Number.isNaN(parseInt(queryPage)) || parseInt(queryPage) <= 0 ? 1 : parseInt(queryPage);
  const limit =
    Number.isNaN(parseInt(queryLimit)) || parseInt(queryLimit) > 96 || parseInt(queryLimit) <= 0
      ? 24
      : parseInt(queryLimit);

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['orders', { page, limit }],
    queryFn: () => getOrdersByPage(page, limit),
    staleTime: 1000 * 60 * 5
  });

  const pageChange = (page: number) => {
    setSearchParams((prev) => {
      prev.set('page', page.toString());
      return prev;
    });
  };

  const limitChange = (limit: string) => {
    setSearchParams((prev) => {
      prev.set('limit', limit);
      prev.delete('page');
      return prev;
    });
  };

  if (isLoading) return <h1>Cargando página ...</h1>;

  return (
    <>
      <Title title="Ventas" subtitle="Ventas realizadas" />

      {isFetching || !data ? (
        <h1>Cargando datos ...</h1>
      ) : (
        <>
          <OrdersStats />
          {data.orders.length > 0 ? (
            <OrderList orders={data.orders}>
              <ProductPerPageOptions
                limit={limit}
                page={page}
                elements="productos"
                totalItems={data.pagination.totalItems}
                handleValueChange={limitChange}
              />
            </OrderList>
          ) : (
            <h2 className="text-center font-medium py-8">No se encontraron ventas.</h2>
          )}
          <CustomPagination
            totalPages={data.pagination.totalPages}
            handlePageChange={pageChange}
            currentPage={+page}
            nextPage={data.pagination.nextPage}
            prevPage={data.pagination.prevPage}
          />
        </>
      )}
    </>
  );
};
