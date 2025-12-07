import { CustomPagination } from '@/components/common/custom-pagination';
import { Title } from '@/components/common/title';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductPerPageOptions } from '@/modules/products/components/product-per-page-options';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useRef } from 'react';
import { getOrdersByPage } from '../actions/get-orders-by-page.actions';
import { OrderList } from '../components/order-list';

import { OrderListFilters } from '../components/order-list-filters';
import { OrdersStats } from '../components/orders-stats';
import { useOrderParams } from '../hooks/useOrderParams';

export const OrderListPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { filters, setLimit, setPage, setSearch, setFilters } = useOrderParams();

  const { data, isFetching, isLoading } = useQuery({
    queryKey: ['orders', filters],
    queryFn: () => getOrdersByPage(filters),
    staleTime: 1000 * 60 * 5
  });

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const search = inputRef.current?.value ?? '';
      setSearch(search);
    }
  };

  const handleSearchClick = () => {
    const search = inputRef.current?.value ?? '';
    setSearch(search);
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
          <div className="flex gap-4 py-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input ref={inputRef} placeholder="Buscar órdenes..." className="pl-10" onKeyUp={handleSearch} />
            </div>
            <Button onClick={handleSearchClick}>Buscar</Button>
          </div>
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
