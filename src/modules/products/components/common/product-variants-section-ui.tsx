import { Button } from '@/components/ui/button';
import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/get-all-attributes.interface';
import { Plus } from 'lucide-react';

interface Props {
  attributes: GetAttributesApiResponse;
  attributesSelectedCount: number;
  variantsField: { id: string; variantId?: number }[];
  onAppend: () => void;
  onRemove: (id: number) => void;
  VariantCard: React.ComponentType<{
    id: string;
    index: number;
    variantId?: number;
    attributes: GetAttributesApiResponse;
    onDelete: (id: number) => void;
  }>;
}

export const ProductVariantsSectionUI = ({
  attributes,
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
        <VariantCard
          key={variant.id}
          id={variant.id}
          index={index}
          variantId={variant.variantId}
          attributes={attributes}
          onDelete={onRemove}
        />
      ))}
    </div>
  );
};
