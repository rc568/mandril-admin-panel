import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  limit: number;
  page: number;
  totalItems: number;
  elements?: string;
  handleValueChange: (value: string) => void;
}

export const ProductPerPageOptions = ({
  limit,
  totalItems,
  page,
  elements = 'elementos',
  handleValueChange
}: Props) => {
  return (
    <div className="flex justify-between items-center text-muted-foreground font-normal text-sm mt-4">
      <div className="flex items-center gap-2">
        <span>Mostrar</span>

        <Select value={limit.toString()} onValueChange={handleValueChange}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder={limit} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24">24</SelectItem>
            <SelectItem value="48">48</SelectItem>
            <SelectItem value="72">72</SelectItem>
            <SelectItem value="96">96</SelectItem>
          </SelectContent>
        </Select>

        <span>{elements} por página.</span>
      </div>

      <span>
        Mostrando {limit * (page - 1) + 1} - {page * limit} de {totalItems} {elements}
      </span>
    </div>
  );
};
