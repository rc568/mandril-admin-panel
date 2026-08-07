import { CheckboxField } from '@/components/common/form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { capitalizeFirstLetter } from '@/lib/format-string';
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

        <div className="max-h-96 overflow-y-auto space-y-2">
          {attributes.map((attr) => {
            return (
              <CheckboxField
                key={attr.id}
                label={capitalizeFirstLetter(attr.name)}
                checked={selectedIds.includes(attr.id)}
                onCheckedChange={() => onChecked(attr.id)}
                disabled={defaultIds?.includes(attr.id)}
              />
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
