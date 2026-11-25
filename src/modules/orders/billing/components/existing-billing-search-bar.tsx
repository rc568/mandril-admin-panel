import { SearchBarDebounce } from '@/components/common/search-bar-debounce';
import { useSearchClients } from '@/hooks/query';
import type { SearchClient } from '@/services/client/interfaces/client.interface';
import { useState } from 'react';

interface Props {
  setClientData: (client: SearchClient) => void;
}

export const ExistingBillingSearchBar = ({ setClientData }: Props) => {
  const [search, setSearch] = useState<string>('');
  const [showClientList, setShowClientList] = useState(false);

  const {
    data: searchClients,
    isLoading,
    isError
  } = useSearchClients({
    params: { q: search },
    enabled: search.trim().length !== 0
  });

  const { clients } = searchClients ?? {};

  const onSearch = (query: string) => {
    const cleanQuery = query.trim();
    if (cleanQuery === '') {
      setSearch('');
      setShowClientList(false);
      return;
    }

    setSearch(cleanQuery);
    setShowClientList(true);
  };

  const handleSelectClient = (client: SearchClient) => {
    setClientData(client);
    setShowClientList(false);
  };

  return (
    <div className="relative">
      <span className="text-sm text-muted-foreground">Buscar en datos de facturación existentes (opcional).</span>
      <SearchBarDebounce
        id="search-clients"
        onSearch={onSearch}
        onBlur={() => setShowClientList(false)}
        onFocus={() => setShowClientList(true)}
        placeholder="Búsqueda por razón social o RUC"
      />

      {showClientList && (
        <div className="absolute left-0 right-0 top-[80%] border rounded-lg z-50 shadow-lg">
          {isLoading ? (
            <div className="bg-background max-h-64 py-2 px-4 text-sm text-muted-foreground">Buscando...</div>
          ) : isError ? (
            <div className="bg-background max-h-64 py-2 px-4 text-sm text-destructive">
              Ocurrió un error al consultar los comprobantes.
            </div>
          ) : clients?.length === 0 ? (
            <div className="bg-background max-h-64 py-2 px-4 text-sm text-muted-foreground">
              No se encontraron resultados.
            </div>
          ) : (
            <ul className="max-h-64 overflow-y-auto bg-background divide-y">
              {clients?.map((client) => (
                <li key={client.clientId} className="py-2 px-4 hover:bg-accent transition-colors">
                  <button
                    type="button"
                    className="w-full cursor-pointer"
                    onClick={() => handleSelectClient(client)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col items-start text-sm gap-y-1">
                        <p>{client.billingName}</p>
                        <p className="text-muted-foreground">
                          {client.billingDocumentNumberType}
                          {client.billingDocumentNumber && <span>: {client.billingDocumentNumber}</span>}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
