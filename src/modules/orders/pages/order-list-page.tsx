import { CustomPagination } from '@/components/common/custom-pagination';
import { Title } from '@/components/common/title';
import { ProductPerPageOptions } from '@/modules/products/components/product-per-page-options';
import { useQuery } from '@tanstack/react-query';
import { getOrdersByPage } from '../actions/get-orders-by-page.actions';
import { OrderList } from '../components/order-list';

import { SearchBar } from '@/components/common/search-bar';
import { OrderListFilters } from '../components/order-list-filters';
import { OrderListSortBy } from '../components/order-list-sort-by';
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
          <SearchBar onSearch={setSearch} placeholder="Buscar por factura, cliente, razón social, ..." />
          <div className="flex gap-2 pb-4">
            <OrderListFilters
              initialFilters={{
                status: filters.status,
                channel: filters.channel,
                invoiceType: filters.invoiceType,
                startDate: filters.startDate,
                endDate: filters.endDate
              }}
              applyFilters={setFilters}
            />
            <OrderListSortBy sortBy={filters.sortBy} handleClick={setSortBy} />
          </div>
          {data.orders.length > 0 ? (
            <OrderList orders={data.orders}>
              <ProductPerPageOptions
                limit={filters.limit}
                page={filters.page}
                elements="productos"
                totalItems={data.pagination.totalItems}
                handleValueChange={setLimit}
              />
            </OrderList>
          ) : (
            <h2 className="text-center font-medium py-8">No se encontraron ventas.</h2>
          )}
          <CustomPagination
            totalPages={data.pagination.totalPages}
            handlePageChange={setPage}
            currentPage={filters.page}
            nextPage={data.pagination.nextPage}
            prevPage={data.pagination.prevPage}
          />
        </>
      )}
    </>
  );
};
