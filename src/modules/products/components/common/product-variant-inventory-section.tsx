import { InputField } from '@/components/common/form';
import type { ReactNode } from 'react';

interface Props {
  availableQuantity: number;
  action?: ReactNode;
  description: string;
}

export const ProductVariantInventorySection = ({ availableQuantity, action, description }: Props) => {
  return (
    <section className="space-y-2">
      <div className="space-y-2">
        <h3 className="text-base font-medium text-foreground">Inventario</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <div className="flex items-end justify-between">
        <InputField
          label="Stock disponible"
          type="number"
          value={availableQuantity}
          readOnly
          className="text-muted-foreground shadow-none hover:shadow-none focus-visible:border-input focus-visible:ring-0"
        />
        {action}
      </div>
    </section>
  );
};
