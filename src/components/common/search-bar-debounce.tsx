import { Search } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface SearchBarProps {
  id?: string;
  placeholder?: string;
  showButton?: boolean;
  onSearch: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const SearchBarDebounce = ({
  id,
  placeholder = 'Buscar...',
  showButton = false,
  onSearch,
  onBlur,
  onFocus
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<number>(null);

  const setSearch = () => {
    const search = inputRef.current?.value ?? '';
    onSearch(search);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setSearch();
  };

  const handleSearchButton = () => setSearch();

  const handleChange = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }

    const timer = setTimeout(() => {
      setSearch();
    }, 350);

    timeRef.current = timer;
  };

  return (
    <div className="flex gap-4 py-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          id={id}
          ref={inputRef}
          placeholder={placeholder}
          autoComplete={'off'}
          className="pl-10"
          onKeyUp={handleEnter}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </div>

      {showButton && (
        <Button onClick={handleSearchButton} type="button">
          Buscar
        </Button>
      )}
    </div>
  );
};
