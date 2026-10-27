import { InputField } from '@/components/common/form';
import type { ReactNode } from 'react';

interface Props {
  availableQuantity: number;
  action?: ReactNode;
  description: string;
}

export const ProductVariantInventorySection = ({ availableQuantity, action, description }: Props) => {
  return (
    <section className="space-y-3 border-t pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-foreground">Inventario</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {action}
      </div>

      <div className="max-w-xs">
        <InputField
          label="Stock disponible"
          type="number"
          value={availableQuantity}
          readOnly
          className="text-muted-foreground shadow-none hover:shadow-none focus-visible:border-input focus-visible:ring-0"
        />
      </div>
    </section>
  );
};
