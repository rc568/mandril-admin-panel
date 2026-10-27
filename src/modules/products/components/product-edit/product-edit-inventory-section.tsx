import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/modules/auth/store/auth.store';
import { useState } from 'react';
import { ProductVariantInventorySection } from '../common/product-variant-inventory-section';
import { ProductInventoryAdjustmentDialog } from './product-inventory-adjustment-dialog';

interface Props {
  availableQuantity: number;
  variantId?: number;
}

export const ProductEditInventorySection = ({ availableQuantity, variantId }: Props) => {
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const action = variantId && isAdmin && (
    <Button type="button" variant="outline" size="sm" onClick={() => setIsAdjustmentOpen(true)}>
      Ajustar stock disponible
    </Button>
  );

  return (
    <>
      <ProductVariantInventorySection
        availableQuantity={availableQuantity}
        action={action}
        description={
          variantId
            ? 'Las compras ingresan unidades; los administradores pueden registrar conteos manuales.'
            : 'Guarda la variante para habilitar ajustes manuales de inventario.'
        }
      />
      {variantId && isAdmin && (
        <ProductInventoryAdjustmentDialog
          variantId={variantId}
          availableQuantity={availableQuantity}
          open={isAdjustmentOpen}
          onOpenChange={setIsAdjustmentOpen}
        />
      )}
    </>
  );
};
