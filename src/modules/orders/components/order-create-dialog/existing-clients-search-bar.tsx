import { SearchBarDebounce } from '@/components/common/search-bar-debounce';
import { useSearchClients } from '@/hooks/query';
import type { SearchClient } from '@/services/client/interfaces/client.interface';
import { useState } from 'react';

interface Props {
  setClientData: (client: SearchClient) => void;
}

export const ExistingClientsSearchBar = ({ setClientData }: Props) => {
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
      <span className="pl-2 text-sm text-muted-foreground">Buscar datos de cliente existente (opcional).</span>
      <SearchBarDebounce
        id="search-clients"
        onSearch={onSearch}
        onBlur={() => setShowClientList(false)}
        onFocus={() => setShowClientList(true)}
        placeholder="Búsqueda por documento, nombre o contacto..."
      />

      {showClientList && (
        <div className="absolute left-0 right-0 top-[80%] border rounded-lg z-50 shadow-lg">
          {isLoading ? (
            <div className="bg-background max-h-64 py-2 px-4 text-sm text-muted-foreground">Buscando...</div>
          ) : isError ? (
            <div className="bg-background max-h-64 py-2 px-4 text-sm text-destructive">
              Ocurrió un error al consultar los clientes.
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
                        <span>{client.contactName ?? 'Cliente registrado'}</span>
                        {client.documentNumberType && client.documentNumber && (
                          <span className="text-muted-foreground">
                            {`${client.documentNumberType}: ${client.documentNumber}`}
                          </span>
                        )}
                        <span className="text-muted-foreground">
                          {client.phoneNumber1
                            ? `Celular del contacto: ${client.phoneNumber1}`
                            : 'Sin información de contacto'}
                        </span>
                        {client.email && <span className="text-muted-foreground">{client.email}</span>}
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
