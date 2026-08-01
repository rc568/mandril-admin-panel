import { CustomPagination } from '@/components/common/custom-pagination';
import { SearchBar } from '@/components/common/search-bar';
import { ProductPerPageOptions } from '@/modules/products/components/product-per-page-options';
import type { GetOrdersMapped, OrderMapped } from '../../interfaces/api/get-orders-mapped.interface';
import type { GetOrdersFilters } from '../../interfaces/ui/get-orders-filters.interface';

import { useState } from 'react';
import { OrderDetailsSheet } from './order-details-sheet';
import { OrderListFilters } from './order-list-filters';
import { OrderListSortBy } from './order-list-sort-by';
import { OrderTable } from './order-table';

interface Props {
  orders: OrderMapped[];
  pagination: GetOrdersMapped['pagination'];
  filters: GetOrdersFilters;
  setPage: (page: number) => void;
  setLimit: (limit: string) => void;
  setSearch: (search: string) => void;
  setFilters: (newFilters: Partial<GetOrdersFilters>) => void;
  setSortBy: (sortBy: string) => void;
}

export const OrderListSection = ({
  filters,
  orders,
  pagination,
  setLimit,
  setPage,
  setSearch,
  setFilters,
  setSortBy
}: Props) => {
  const [selectedOrder, setSelectedOrder] = useState<OrderMapped | null>(null);
  const setOrderDetailSheet = (order: OrderMapped | null) => setSelectedOrder(order);

  return (
    <>
      <SearchBar onSearch={setSearch} placeholder="Buscar por factura, cliente, razón social, ..." />

      <div className="flex gap-2 pb-4">
        <OrderListFilters
          urlFilters={{
            status: filters.status,
            channel: filters.channel,
            invoiceType: filters.invoiceType,
            startDate: filters.startDate,
            endDate: filters.endDate,
            search: filters.search
          }}
          applyFilters={setFilters}
        />
        <OrderListSortBy sortBy={filters.sortBy} handleClick={setSortBy} />
      </div>

      {orders.length > 0 ? (
        <OrderTable orders={orders} onRowClick={setOrderDetailSheet}>
          <ProductPerPageOptions
            limit={filters.limit}
            page={filters.page}
            elements="productos"
            totalItems={pagination.totalItems}
            handleValueChange={setLimit}
          />
        </OrderTable>
      ) : (
        <h2 className="text-center font-medium py-8">No se encontraron ventas.</h2>
      )}

      <CustomPagination
        totalPages={pagination.totalPages}
        handlePageChange={setPage}
        currentPage={filters.page}
        nextPage={pagination.nextPage}
        prevPage={pagination.prevPage}
      />

      <OrderDetailsSheet
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        order={selectedOrder}
      />
    </>
  );
};
