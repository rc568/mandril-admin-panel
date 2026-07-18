import { Title } from '@/components/common/title';
import { Button } from '@/components/ui/button';
import { useOrders } from '@/hooks/query/order';
import { useState } from 'react';
import { OrderCreateDialog } from '../components/order-create-dialog/order-create-dialog';
import { OrderListSection } from '../components/order-list-section/order-list-section';
import { OrdersStats } from '../components/orders-stats';
import { useOrderParams } from '../hooks/useOrderParams';

export const OrderListPage = () => {
  const [open, setOpen] = useState(false);
  const { filters, setLimit, setPage, setSearch, setFilters, setSortBy } = useOrderParams();
  const { data, isFetching, isLoading } = useOrders(filters);

  if (isLoading) return <h1>Cargando página ...</h1>;

  return (
    <>
      <div className="flex justify-between items-center">
        <Title title="Ventas" subtitle="Ventas realizadas" showLink={false} />
        <Button onClick={() => setOpen(true)}>Agregar venta</Button>
      </div>

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

          <OrderCreateDialog open={open} onOpenChange={(open) => !open && setOpen(false)} />
        </>
      )}
    </>
  );
};
