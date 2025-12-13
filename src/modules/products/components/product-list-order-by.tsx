import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SortDesc } from 'lucide-react';
import { PRODUCT_ORDER_BY_ENTRIES, PRODUCT_ORDER_BY_OPTIONS } from '../constants/product.constants';

interface Props {
  orderBy?: string;
  handleClick: (orderBy: string) => void;
}

export const ProductListOrderBy = ({ orderBy, handleClick }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <SortDesc />
          Ordenar por: {''}
          {orderBy
            ? PRODUCT_ORDER_BY_OPTIONS[orderBy as keyof typeof PRODUCT_ORDER_BY_OPTIONS]
            : PRODUCT_ORDER_BY_OPTIONS.name_asc}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="end">
        <ul className="flex flex-col">
          {PRODUCT_ORDER_BY_ENTRIES.map(({ key, value }) => (
            <li key={key}>
              <Button variant="ghost" className="w-full justify-start" onClick={() => handleClick(key)}>
                {value}
              </Button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
