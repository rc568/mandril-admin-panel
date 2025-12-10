import { Search } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
}

export const SearchBar = ({ placeholder = 'Buscar...', onSearch }: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const setSearch = () => {
    const search = inputRef.current?.value ?? '';
    onSearch(search);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') setSearch();
  };

  const handleSearchButton = () => setSearch();

  return (
    <div className="flex gap-4 py-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input ref={inputRef} placeholder={placeholder} className="pl-10" onKeyUp={handleEnter} />
      </div>
      <Button onClick={handleSearchButton}>Buscar</Button>
    </div>
  );
};
