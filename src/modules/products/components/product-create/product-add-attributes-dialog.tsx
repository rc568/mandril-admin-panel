import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/get-all-attributes.interface';
import { useProductCreateContext } from '../../hooks/use-product-create-context';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attributes: GetAttributesApiResponse;
}

export const ProductAddAttributesDialog = ({ open, onOpenChange, attributes }: Props) => {
  const { checkedAttributeId, clearAttributes, selectedAttributesId } = useProductCreateContext();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Seleccionar atributos</DialogTitle>
          <DialogDescription>Escoja uno o más atributos para crear variantes de un mismo producto.</DialogDescription>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto">
          {attributes.map((attr) => {
            return (
              <div key={attr.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={attr.name}
                  checked={selectedAttributesId.includes(attr.id)}
                  onCheckedChange={() => checkedAttributeId(attr.id)}
                />
                <Label htmlFor={attr.name} className="capitalize text-sm text-foreground cursor-pointer flex-1">
                  {attr.name}
                </Label>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={clearAttributes} variant={'outline'} type="button">
            Borrar atributos
          </Button>
          <Button type="button">Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
