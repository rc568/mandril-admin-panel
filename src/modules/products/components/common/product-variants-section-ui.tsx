import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Props {
  attributesSelectedCount: number;
  variantsField: { id: string; variantId?: number }[];
  onAppend: () => void;
  onRemove: (id: number) => void;
  VariantCard: React.ComponentType<{
    id: string;
    index: number;
    variantId?: number;
    onDelete: (id: number) => void;
  }>;
}

export const ProductVariantsSectionUI = ({
  attributesSelectedCount,
  variantsField,
  onAppend,
  onRemove,
  VariantCard
}: Props) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold">Variantes del producto</h2>
        <Button type="button" disabled={attributesSelectedCount <= 0} onClick={onAppend}>
          <Plus />
          Agregar Variante
        </Button>
      </div>

      {variantsField.map((variant, index) => (
        <VariantCard key={variant.id} id={variant.id} index={index} variantId={variant.variantId} onDelete={onRemove} />
      ))}
    </div>
  );
};
