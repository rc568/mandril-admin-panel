import { Title } from '@/components/common/title';
import { useOrderById } from '@/hooks/query/order';
import { useSalesChannel } from '@/hooks/query/sales-channel';
import { useNavigate, useParams } from 'react-router';
import { OrderUpdateForm } from '../components/order-update/order-update-form';
import { PageMessage } from '../components/page-message';

export const OrderUpdatePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderQuery = useOrderById(id);
  const salesChannelQuery = useSalesChannel();

  if (!id) {
    return <PageMessage title="No se indicó una orden" onBack={() => navigate('/ventas')} />;
  }

  if (orderQuery.isPending || salesChannelQuery.isPending) {
    return <PageMessage title="Cargando los datos de la orden..." />;
  }

  if (orderQuery.isError || salesChannelQuery.isError) {
    return (
      <PageMessage
        title="No se pudo cargar la orden."
        onBack={() => navigate('/ventas')}
        onRetry={() => {
          orderQuery.refetch();
          salesChannelQuery.refetch();
        }}
      />
    );
  }

  const order = orderQuery.data;
  if (!order) return <PageMessage title="No se encontró la orden." onBack={() => navigate('/ventas')} />;

  if (order.type !== 'SALE') {
    return <PageMessage title="Este tipo de orden no se puede editar." onBack={() => navigate('/ventas')} />;
  }

  if (order.status !== 'PENDING' && order.status !== 'PAID') {
    return (
      <PageMessage
        title="Esta orden ya no se puede editar."
        description="Solo se pueden editar órdenes pendientes o pagadas."
        onBack={() => navigate('/ventas')}
      />
    );
  }

  const salesChannel = salesChannelQuery.data?.find((channel) => channel.channel === order.channel);
  if (!salesChannel) {
    return (
      <PageMessage
        title="No se encontró el canal de venta de esta orden."
        description="Vuelve al listado e inténtalo nuevamente."
        onBack={() => navigate('/ventas')}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Title title="Editar orden" subtitle="Modifica los datos de una venta pendiente o pagada." showLink={false} />
      <OrderUpdateForm order={order} salesChannelId={salesChannel.id} />
    </div>
  );
};
