import { SearchBarDebounce } from '@/components/common/search-bar-debounce';
import { useSearchClients } from '@/hooks/query';
import type { SearchClient } from '@/services/client/interfaces/client.interface';
import { useState } from 'react';

export const ExistingClientsSearchBar = () => {
  const [search, setSearch] = useState<string>('');
  const [showClientList, setShowClientList] = useState(false);

  const { data: searchClients } = useSearchClients({
    params: { q: search },
    enabled: search.trim().length !== 0
  });

  const { clients } = searchClients ?? {};

  const onSearch = (query: string) => {
    const cleanQuery = query.trim();
    if (cleanQuery === '') return;

    setSearch(cleanQuery);
    setShowClientList(true);
  };

  const setClientData = (client: SearchClient) => {
    console.log(client);
  };

  return (
    <div className="relative">
      <span className="pl-2 text-sm text-muted-foreground">Buscar datos de cliente existente (opcional).</span>
      <SearchBarDebounce
        id="search-clients"
        onSearch={onSearch}
        onBlur={() => setShowClientList(false)}
        onFocus={() => setShowClientList(true)}
        placeholder="Búsqueda por RUC, Razón Social, Nombre del cliente ..."
      />

      {showClientList && (
        <div className="absolute left-0 right-0 top-[80%] border rounded-lg z-50 shadow-lg">
          {clients?.length === 0 ? (
            <div className="bg-background max-h-64 py-2 px-4 text-sm text-muted-foreground">
              No se encontraron resultados.
            </div>
          ) : (
            <ul className="max-h-60 overflow-y-auto bg-background divide-y">
              {clients?.map((client) => (
                <li key={client.clientId} className="py-2 px-4 hover:bg-accent transition-colors">
                  <button
                    type="button"
                    className="w-full cursor-pointer"
                    onClick={() => setClientData(client)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col items-start text-sm gap-y-1">
                        <span>{client.bussinessName}</span>
                        <span className="text-muted-foreground">
                          {client.documentType === 'SIN DOCUMENTO'
                            ? 'Sin documento'
                            : `${client.documentType}: ${client.documentNumber}`}
                        </span>
                        <span className="text-muted-foreground">
                          {client.contactName ? `Contacto: ${client.contactName}` : 'Sin información de contacto'}
                        </span>
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
