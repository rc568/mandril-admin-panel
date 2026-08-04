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
import type { GetAttributesApiResponse } from '@/services/attributes/interfaces/api';

interface Props {
  open: boolean;
  attributes: GetAttributesApiResponse;
  selectedIds: number[];
  defaultIds?: number[];
  onOpenChange: (open: boolean) => void;
  onChecked: (id: number) => void;
  onClear: () => void;
}

export const ProductAddAttributesDialogUI = ({
  open,
  attributes,
  selectedIds,
  defaultIds,
  onOpenChange,
  onChecked,
  onClear
}: Props) => {
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
                  checked={selectedIds.includes(attr.id)}
                  onCheckedChange={() => onChecked(attr.id)}
                  disabled={defaultIds?.includes(attr.id)}
                />
                <Label htmlFor={attr.name} className="capitalize text-sm text-foreground cursor-pointer flex-1">
                  {attr.name}
                </Label>
              </div>
            );
          })}
        </div>

        <DialogFooter className="justify-start">
          <DialogClose asChild className="flex-1">
            <Button variant="outline" type="button">
              Cerrar
            </Button>
          </DialogClose>
          <Button onClick={onClear} variant={'outline'} type="button" className="flex-1">
            Borrar atributos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
