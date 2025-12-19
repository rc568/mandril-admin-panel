import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SortDesc } from 'lucide-react';
import { ORDER_SORT_BY_ENTRIES, ORDER_SORT_BY_OPTIONS } from '../constants/order.constants';

interface Props {
  sortBy?: string;
  handleClick: (sortBy: string) => void;
}

export const OrderListSortBy = ({ sortBy, handleClick }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <SortDesc />
          Ordenar por: {''}
          {sortBy
            ? ORDER_SORT_BY_OPTIONS[sortBy as keyof typeof ORDER_SORT_BY_OPTIONS]
            : ORDER_SORT_BY_OPTIONS.date_desc}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="end">
        <ul className="flex flex-col">
          {ORDER_SORT_BY_ENTRIES.map(({ key, value }) => (
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
