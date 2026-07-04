import { Badge } from '@/components/ui/badge';
import { DEFAULT_BADGE_CLASSNAME } from '@/modules/orders/constants/order.constants';

export const BaseBadge = ({ label, className = DEFAULT_BADGE_CLASSNAME }: { label: string; className: string }) => {
  return <Badge className={className}>{label}</Badge>;
};
